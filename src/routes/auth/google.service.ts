import { Injectable } from '@nestjs/common'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'
import { GoogleAuthStateType } from 'src/routes/auth/auth.model'
import { AuthRepository } from 'src/routes/auth/auth.repo'
import { AuthService } from 'src/routes/auth/auth.service'
import { GoogleUserInfoError } from 'src/routes/auth/error.model'
import { RolesService } from 'src/routes/auth/roles.service'
import envConfig from 'src/shared/config'
import { HashingService } from 'src/shared/services/hashing.service'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class GoogleService {
  private oauth2Client: OAuth2Client
  constructor(
    private readonly authService: AuthService,
    private readonly authRepository: AuthRepository,
    private readonly hashingService: HashingService,
    private readonly rolesService: RolesService
  ) {
    this.oauth2Client = new google.auth.OAuth2(
      envConfig.GOOGLE_CLIENT_ID,
      envConfig.GOOGLE_CLIENT_SECRET,
      envConfig.GOOGLE_REDIRECT_URI
    )
  }

  getAuthorizationUrl({ userAgent, ip }: GoogleAuthStateType) {
    const scope = ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']

    const stateString = Buffer.from(
      JSON.stringify({
        userAgent,
        ip
      })
    ).toString('base64')

    const url = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope,
      include_granted_scopes: true,
      state: stateString
    })
    return { url }
  }

  async googleCallback({ code, state }: { code: string; state: string }) {
    try {
      let userAgent = 'unknown'
      let ip = 'unknown'
      try {
        if (state) {
          const clientInfo = JSON.parse(Buffer.from(state, 'base64').toString()) as GoogleAuthStateType
          userAgent = clientInfo.userAgent
          ip = clientInfo.ip
        }
      } catch (error) {
        console.error('Error parsing state: ', error)
      }

      const { tokens } = await this.oauth2Client.getToken(code)
      this.oauth2Client.setCredentials(tokens)

      const oauth2 = google.oauth2({
        auth: this.oauth2Client,
        version: 'v2'
      })
      const { data } = await oauth2.userinfo.get()
      if (!data.email) {
        throw GoogleUserInfoError
      }

      let user = await this.authRepository.findUniqueUserIncludeRole({ email: data.email })

      if (!user) {
        const clientRoleId = await this.rolesService.getClientRoleId()
        const uuid = uuidv4()
        const hashedPassword = await this.hashingService.hashPassword(uuid)

        user = await this.authRepository.createUserIncludeRole({
          name: data.name ?? '',
          email: data.email,
          phoneNumber: '',
          password: hashedPassword,
          roleId: clientRoleId,
          avatar: data.picture ?? null
        })
      }
      const device = await this.authRepository.createDevice({ userId: user.id, userAgent, ip })

      const authTokens = await this.authService.generateTokens({
        userId: user.id,
        deviceId: device.id,
        roleId: user.roleId,
        roleName: user.role.name
      })
      return authTokens
    } catch (error) {
      console.error('Error in googleCallback: ', error)
      throw error
    }
  }
}
