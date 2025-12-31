import { useTranslation } from 'react-i18next'
import CustomDropdown from './CustomDropdown'

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const value = i18n.language?.startsWith('hi') ? 'hi' : 'en'
  const options = [
    { value: 'en', label: 'EN' },
    { value: 'hi', label: 'हि' },
  ]

  return (
    <div className="w-16 sm:w-20">
      <CustomDropdown
        value={value}
        onChange={(lng) => i18n.changeLanguage(lng)}
        options={options}
        placeholder="EN"
      />
    </div>
  )
}

export default LanguageSwitcher
