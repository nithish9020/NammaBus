const fs = require('fs');
let code = fs.readFileSync('src/components/layout/sidebar.tsx', 'utf8');

code = code.replace(
  'const isActive = location.pathname.startsWith(item.path);',
  'const isActive = item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path);'
);

fs.writeFileSync('src/components/layout/sidebar.tsx', code);
