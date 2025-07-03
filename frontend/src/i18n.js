import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "Home": "Home",
      "Login": "Login",
      "Signup": "Signup",
      "Dashboard": "Dashboard",
      "Profile": "Profile",
      "Logout": "Logout",
      "Welcome": "Welcome",
      "Email": "Email",
      "Edit Profile": "Edit Profile",
      "Change Password": "Change Password",
      "Cancel Password Change": "Cancel Password Change",
      "Update Password": "Update Password",
      "Username": "Username",
      "Bio": "Bio",
      "Register": "Register",
      "Sign Up": "Sign Up",
      "Password": "Password",
      "Back to Login": "Back to Login",
      "404 Page Not Found": "404 Page Not Found",
      "Collaboration Platform": "Collaboration Platform",
      "Loading...": "Loading...",
      "Save": "Save",
      "Cancel": "Cancel",
      "Profile updated successfully!": "Profile updated successfully!",
      "Password updated successfully!": "Password updated successfully!",
      "Invalid username or password.": "Invalid username or password.",
      "Registration successful! You can now log in.": "Registration successful! You can now log in.",
      "Registration successful! Redirecting...": "Registration successful! Redirecting...",
      "Failed to update profile.": "Failed to update profile.",
      "Failed to update password.": "Failed to update password.",
      "Failed to load profile.": "Failed to load profile."
    }
  },
  hi: {
    translation: {
      "Home": "होम",
      "Login": "लॉगिन",
      "Signup": "साइनअप",
      "Dashboard": "डैशबोर्ड",
      "Profile": "प्रोफ़ाइल",
      "Logout": "लॉगआउट",
      "Welcome": "स्वागत है",
      "Email": "ईमेल",
      "Edit Profile": "प्रोफ़ाइल संपादित करें",
      "Change Password": "पासवर्ड बदलें",
      "Cancel Password Change": "पासवर्ड परिवर्तन रद्द करें",
      "Update Password": "पासवर्ड अपडेट करें",
      "Username": "यूज़रनेम",
      "Bio": "बायो",
      "Register": "रजिस्टर करें",
      "Sign Up": "साइन अप करें",
      "Password": "पासवर्ड",
      "Back to Login": "लॉगिन पर वापस जाएं",
      "404 Page Not Found": "404 पृष्ठ नहीं मिला",
      "Collaboration Platform": "सहयोग मंच",
      "Loading...": "लोड हो रहा है...",
      "Save": "सहेजें",
      "Cancel": "रद्द करें",
      "Profile updated successfully!": "प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!",
      "Password updated successfully!": "पासवर्ड सफलतापूर्वक अपडेट हो गया!",
      "Invalid username or password.": "अमान्य यूज़रनेम या पासवर्ड।",
      "Registration successful! You can now log in.": "पंजीकरण सफल! अब आप लॉगिन कर सकते हैं।",
      "Registration successful! Redirecting...": "पंजीकरण सफल! पुनः निर्देशित किया जा रहा है...",
      "Failed to update profile.": "प्रोफ़ाइल अपडेट करने में विफल।",
      "Failed to update password.": "पासवर्ड अपडेट करने में विफल।",
      "Failed to load profile.": "प्रोफ़ाइल लोड करने में विफल।"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('lng') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 