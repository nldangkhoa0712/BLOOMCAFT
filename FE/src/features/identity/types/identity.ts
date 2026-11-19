export interface LoginCommand {
  email: string
  password: string
}

export interface IdentityProfile {
  avatarUrl: string | null
  email: string
  fullName: string
  id: string
  phone: string | null
  roles: Array<'ADMIN' | 'CUSTOMER' | 'FLORIST'>
}

export interface LoginResult {
  accessToken: string
  profile: IdentityProfile
}

export interface UpdateProfileCommand {
  fullName: string
  phone: string
}

export interface RegisterCommand {
  confirmPassword: string
  email: string
  fullName: string
  password: string
}
