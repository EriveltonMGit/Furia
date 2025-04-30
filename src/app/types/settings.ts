export interface UserSettings {
    account: {
      username: string
      email: string
      language: string
    }
    notifications: {
      enabled: boolean
      email: boolean
      push: boolean
      volume: number
    }
    appearance: {
      darkMode: boolean
      accentColor: string
      fontSize: string
    }
    privacy: {
      twoFactor: boolean
      profileVisibility: string
      dataSharing: {
        stats: boolean
        activity: boolean
        preferences: boolean
      }
    }
  }
  
  export const DEFAULT_SETTINGS: UserSettings = {
    account: {
      username: "",
      email: "",
      language: "pt-BR"
    },
    notifications: {
      enabled: true,
      email: true,
      push: true,
      volume: 70
    },
    appearance: {
      darkMode: true,
      accentColor: "#00FF00",
      fontSize: "medium"
    },
    privacy: {
      twoFactor: false,
      profileVisibility: "friends",
      dataSharing: {
        stats: true,
        activity: true,
        preferences: true
      }
    }
  }