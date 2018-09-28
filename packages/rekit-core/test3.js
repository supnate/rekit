const fs = require('fs');

for (let i = 0; i < 3; i++) {
  fs.writeFileSync(`/Users/pwang7/workspace/a1/src/${i}.txt`, 'abc');
}
