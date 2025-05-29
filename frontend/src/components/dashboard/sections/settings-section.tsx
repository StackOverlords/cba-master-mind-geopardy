import { useState } from "react"
import UserIcon from "../../ui/icons/userIcon"

export function SettingsSection() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    gameReminders: true,
    leaderboardUpdates: false,
    newQuestions: true,
  })

  const [preferences, setPreferences] = useState({
    theme: "dark",
    difficulty: "mixed",
    timeLimit: "enabled",
    soundEffects: true,
    animations: true,
  })

  const toggleSwitch = (key: string, section: "notifications" | "preferences") => {
    if (section === "notifications") {
      setNotifications((prev) => ({
        ...prev,
        [key]: !prev[key as keyof typeof prev],
      }))
    } else {
      if (key === "timeLimit") {
        setPreferences((prev) => ({
          ...prev,
          [key]: prev[key] === "enabled" ? "disabled" : "enabled",
        }))
      } else {
        setPreferences((prev) => ({
          ...prev,
          [key]: !prev[key as keyof typeof prev],
        }))
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Manage your account preferences and application settings</p>
      </div>

      {/* Profile Settings */}
      <div className="bg-[#1a1836]/50 border border-[#2a2550]/50 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#2a2550]/50 flex items-center gap-2">
          <UserIcon className="w-5 h-5" />
          <div>
            <h3 className="text-lg font-medium text-white">Profile Settings</h3>
            <p className="text-sm text-slate-400">Update your personal information and profile details</p>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-white text-xl">
              RG
            </div>
            <div className="space-y-2">
              <button className="px-4 py-2 border border-[#2a2550] text-slate-300 rounded-md hover:bg-[#2a2550]/50 transition-colors">
                Change Avatar
              </button>
              <p className="text-sm text-slate-400">JPG, PNG or GIF. Max size 2MB.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-medium text-slate-300">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                defaultValue="Ronald"
                className="w-full bg-[#1a1836] border border-[#2a2550] text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#9f6bff]"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-sm font-medium text-slate-300">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                defaultValue="Gallardo"
                className="w-full bg-[#1a1836] border border-[#2a2550] text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#9f6bff]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              defaultValue="ronald@example.com"
              className="w-full bg-[#1a1836] border border-[#2a2550] text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#9f6bff]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="bio" className="block text-sm font-medium text-slate-300">
              Bio
            </label>
            <textarea
              id="bio"
              placeholder="Tell us about yourself..."
              rows={3}
              className="w-full bg-[#1a1836] border border-[#2a2550] text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#9f6bff]"
            ></textarea>
          </div>

          <button className="px-4 py-2 bg-[#9f6bff] hover:bg-[#8b5cf6] text-white rounded-md transition-colors">
            Save Profile Changes
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-[#1a1836]/50 border border-[#2a2550]/50 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#2a2550]/50 flex items-center gap-2">
          {/* <Bell className="w-5 h-5" /> */}
          <div>
            <h3 className="text-lg font-medium text-white">Notification Preferences</h3>
            <p className="text-sm text-slate-400">Choose how you want to be notified about quiz activities</p>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-slate-300">Email Notifications</label>
                <p className="text-sm text-slate-400">Receive notifications via email</p>
              </div>
              <button
                onClick={() => toggleSwitch("email", "notifications")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#9f6bff] focus:ring-offset-2 ${
                  notifications.email ? "bg-[#9f6bff]" : "bg-[#2a2550]"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.email ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-slate-300">Push Notifications</label>
                <p className="text-sm text-slate-400">Receive browser push notifications</p>
              </div>
              <button
                onClick={() => toggleSwitch("push", "notifications")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#9f6bff] focus:ring-offset-2 ${
                  notifications.push ? "bg-[#9f6bff]" : "bg-[#2a2550]"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.push ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="h-px bg-[#2a2550] my-4"></div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-slate-300">Game Reminders</label>
                <p className="text-sm text-slate-400">Remind me to play daily quizzes</p>
              </div>
              <button
                onClick={() => toggleSwitch("gameReminders", "notifications")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#9f6bff] focus:ring-offset-2 ${
                  notifications.gameReminders ? "bg-[#9f6bff]" : "bg-[#2a2550]"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.gameReminders ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-slate-300">Leaderboard Updates</label>
                <p className="text-sm text-slate-400">Notify when my ranking changes</p>
              </div>
              <button
                onClick={() => toggleSwitch("leaderboardUpdates", "notifications")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#9f6bff] focus:ring-offset-2 ${
                  notifications.leaderboardUpdates ? "bg-[#9f6bff]" : "bg-[#2a2550]"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.leaderboardUpdates ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-slate-300">New Questions</label>
                <p className="text-sm text-slate-400">Notify when new questions are added</p>
              </div>
              <button
                onClick={() => toggleSwitch("newQuestions", "notifications")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#9f6bff] focus:ring-offset-2 ${
                  notifications.newQuestions ? "bg-[#9f6bff]" : "bg-[#2a2550]"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.newQuestions ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Game Preferences */}
      <div className="bg-[#1a1836]/50 border border-[#2a2550]/50 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#2a2550]/50 flex items-center gap-2">
          {/* <Palette className="w-5 h-5" /> */}
          <div>
            <h3 className="text-lg font-medium text-white">Game Preferences</h3>
            <p className="text-sm text-slate-400">Customize your quiz experience and gameplay settings</p>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Theme</label>
              <div className="relative">
                <select
                  value={preferences.theme}
                  onChange={(e) => setPreferences((prev) => ({ ...prev, theme: e.target.value }))}
                  className="w-full bg-[#1a1836] border border-[#2a2550] text-white rounded-md py-2 px-3 appearance-none focus:outline-none focus:ring-2 focus:ring-[#9f6bff]"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="auto">Auto</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">Default Difficulty</label>
              <div className="relative">
                <select
                  value={preferences.difficulty}
                  onChange={(e) => setPreferences((prev) => ({ ...prev, difficulty: e.target.value }))}
                  className="w-full bg-[#1a1836] border border-[#2a2550] text-white rounded-md py-2 px-3 appearance-none focus:outline-none focus:ring-2 focus:ring-[#9f6bff]"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="mixed">Mixed</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-slate-300">Time Limits</label>
                <p className="text-sm text-slate-400">Enable time limits for quiz questions</p>
              </div>
              <button
                onClick={() => toggleSwitch("timeLimit", "preferences")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#9f6bff] focus:ring-offset-2 ${
                  preferences.timeLimit === "enabled" ? "bg-[#9f6bff]" : "bg-[#2a2550]"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.timeLimit === "enabled" ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-slate-300">Sound Effects</label>
                <p className="text-sm text-slate-400">Play sounds for correct/incorrect answers</p>
              </div>
              <button
                onClick={() => toggleSwitch("soundEffects", "preferences")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#9f6bff] focus:ring-offset-2 ${
                  preferences.soundEffects ? "bg-[#9f6bff]" : "bg-[#2a2550]"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.soundEffects ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-slate-300">Animations</label>
                <p className="text-sm text-slate-400">Enable smooth transitions and animations</p>
              </div>
              <button
                onClick={() => toggleSwitch("animations", "preferences")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#9f6bff] focus:ring-offset-2 ${
                  preferences.animations ? "bg-[#9f6bff]" : "bg-[#2a2550]"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.animations ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-[#1a1836]/50 border border-[#2a2550]/50 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#2a2550]/50 flex items-center gap-2">
          {/* <Shield className="w-5 h-5" /> */}
          <div>
            <h3 className="text-lg font-medium text-white">Security & Privacy</h3>
            <p className="text-sm text-slate-400">Manage your account security and privacy settings</p>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-300">
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                className="w-full bg-[#1a1836] border border-[#2a2550] text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#9f6bff]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="newPassword" className="block text-sm font-medium text-slate-300">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                className="w-full bg-[#1a1836] border border-[#2a2550] text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#9f6bff]"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="w-full bg-[#1a1836] border border-[#2a2550] text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#9f6bff]"
              />
            </div>

            <button className="px-4 py-2 border border-[#2a2550] text-slate-300 rounded-md hover:bg-[#2a2550]/50 transition-colors">
              Update Password
            </button>
          </div>

          <div className="h-px bg-[#2a2550] my-4"></div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-slate-300">Two-Factor Authentication</label>
                <p className="text-sm text-slate-400">Add an extra layer of security to your account</p>
              </div>
              <button className="px-3 py-1.5 border border-[#2a2550] text-slate-300 rounded-md hover:bg-[#2a2550]/50 transition-colors text-sm">
                Enable 2FA
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-slate-300">Data Export</label>
                <p className="text-sm text-slate-400">Download your quiz history and statistics</p>
              </div>
              <button className="px-3 py-1.5 border border-[#2a2550] text-slate-300 rounded-md hover:bg-[#2a2550]/50 transition-colors text-sm flex items-center">
                {/* <Database className="w-4 h-4 mr-2" /> */}
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Changes */}
      <div className="flex justify-end space-x-4">
        <button className="px-4 py-2 border border-[#2a2550] text-slate-300 rounded-md hover:bg-[#2a2550]/50 transition-colors">
          Reset to Defaults
        </button>
        <button className="px-4 py-2 bg-[#9f6bff] hover:bg-[#8b5cf6] text-white rounded-md transition-colors">
          Save All Changes
        </button>
      </div>
    </div>
  )
}
