const defaultCodes = {
JavaScript: `

process.stdin.on('data', (data) => {
  // const input = data.toString().trim();
  const input = "oncore";
  console.log(input);
});    

`,
  Python: `

# a = input()
a = "oncore"
print(a)

`,


  '': `/*


언어를 고르세요


*/`,
};

export default defaultCodes;
