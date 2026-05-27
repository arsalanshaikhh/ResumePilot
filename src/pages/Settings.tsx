import { useState } from 'react'
import { Key, User, Bell, Shield, Save, Eye, EyeOff, Check, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Settings() {
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      sessionStorage.setItem('openrouter_api_key', apiKey)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
          <span className="relative">
            <span className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/60 rounded-lg blur opacity-25" />
            <User className="relative w-8 h-8 text-primary" />
          </span>
          Settings
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Manage your account and application preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* API Key Configuration */}
        <div className="group relative p-6 md:p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-border/50 animate-fade-in-up">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/15">
                <Key className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold">OpenRouter API Key</h2>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6">
              Enter your OpenRouter API key to enable AI-powered analysis features.
            </p>
            
            <div className="space-y-4">
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="w-full p-4 pr-12 rounded-xl border border-border/50 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              <p className="flex items-start gap-2 text-xs text-muted-foreground">
                <Shield className="w-4 h-4 flex-shrink-0 mt-0.5 text-yellow-500" />
                Your API key is stored in session storage and cleared when you close this tab. Never share your API key.
              </p>

              <button
                onClick={handleSaveApiKey}
                disabled={!apiKey.trim()}
                className={cn(
                  "w-full py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2",
                  saved
                    ? "bg-green-500 text-white"
                    : apiKey.trim()
                    ? "bg-gradient-to-r from-primary to-primary/90 text-white hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                {saved ? (
                  <>
                    <Check className="w-5 h-5" />
                    Saved Successfully!
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save API Key
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="group relative p-6 md:p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-border/50 animate-fade-in-up animation-delay-100">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/15">
                <User className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold">Account</h2>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6">
              Manage your account settings and preferences.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <span className="font-medium">Email</span>
                <span className="text-muted-foreground">user@example.com</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <span className="font-medium">Plan</span>
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 text-primary text-sm font-medium">Free</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="group relative p-6 md:p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-border/50 animate-fade-in-up animation-delay-200">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/15">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold">Notifications</h2>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6">
              Configure your notification preferences.
            </p>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="relative">
                  <input type="checkbox" defaultChecked className="peer sr-only" />
                  <div className="w-11 h-6 bg-muted rounded-full peer-checked:bg-primary transition-colors" />
                  <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform peer-checked:translate-x-5" />
                </div>
                <span>Email notifications</span>
              </label>
              <label className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="w-11 h-6 bg-muted rounded-full peer-checked:bg-primary transition-colors" />
                  <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform peer-checked:translate-x-5" />
                </div>
                <span>Push notifications</span>
              </label>
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="group relative p-6 md:p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-border/50 animate-fade-in-up animation-delay-300">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/15">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold">Privacy & Security</h2>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6">
              Manage your privacy and security settings.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                <span className="font-medium">Data encryption</span>
                <span className="flex items-center gap-2 text-green-600">
                  <Check className="w-4 h-4" />
                  Enabled
                </span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
                <span className="font-medium">Two-factor authentication</span>
                <span className="text-muted-foreground text-sm">Not configured</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="group relative p-6 md:p-8 rounded-2xl bg-red-50/50 backdrop-blur-sm border border-red-200/50 animate-fade-in-up animation-delay-400">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/15">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>
          </div>
          
          <p className="text-sm text-muted-foreground mb-6">
            Irreversible and destructive actions.
          </p>
          
          <button className="px-6 py-3 border-2 border-red-500 text-red-500 rounded-xl font-medium hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
