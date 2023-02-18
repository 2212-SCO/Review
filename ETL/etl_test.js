const fs = require("fs");

// read the file as a string
fs.readFile("./raw_data/testphoto.csv", "utf-8", (err, data) => {

  // split the data into an array of lines
  const lines = data.split("\n");
  console.log(lines);

  // loop through each line
  for (let i = 0; i < lines.length; i++) {
    //replace the double quote
      lines[i]= lines[i].replace(/\"/g, "");;
  }

  // join the array of lines back into a string
  const newData = lines.join("\n");

  // write the fixed data back to the file
  fs.writeFile("./raw_data/cleanphoto.csv", newData, (err) => {
    console.log("The file was fixed successfully.");
  });
});