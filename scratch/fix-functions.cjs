const fs = require('fs')
const path = require('path')

const filesToFix = [
  "src/pages/realty/PropertyDetail.jsx",
  "src/pages/realty/Favorites.jsx",
  "src/pages/realty/Contact.jsx",
  "src/pages/realty/About.jsx",
  "src/lib/PageNotFound.jsx",
  "src/components/transactions/TransactionItem.jsx",
  "src/components/transactions/TransactionForm.jsx",
  "src/components/seo/SeoMeta.jsx",
  "src/components/seo/JsonLd.jsx",
  "src/components/realty/SiteLayout.jsx",
  "src/components/realty/Navbar.jsx",
  "src/components/realty/MapView.jsx",
  "src/components/dashboard/MonthlyChart.jsx",
  "src/components/realty/Footer.jsx",
  "src/components/dashboard/CategoryChart.jsx",
  "src/components/dashboard/StatCard.jsx"
]

filesToFix.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath)
  if (!fs.existsSync(fullPath)) return
  let content = fs.readFileSync(fullPath, 'utf8')
  
  const regex = /export default function (\w+)\s*\(([^)]*)\)\s*\{/
  const match = content.match(regex)
  if (match) {
    const name = match[1]
    const args = match[2]
    content = content.replace(regex, `const ${name} = (${args}) => {`)
    content += `\nexport default ${name}\n`
    fs.writeFileSync(fullPath, content)
    console.log(`Fixed ${filePath}`)
  }
})
