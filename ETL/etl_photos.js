const csv = require('csv-parser');
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const fs = require('fs');
const Transform = require('stream').Transform;
const csvStringifier = createCsvStringifier(
  {
    header: [
      { id: 'id', title: 'id' },
      { id: 'review_id', title: 'review_id' },
      { id: 'url', title: 'url' }
    ],
  });


let readStream = fs.createReadStream('./raw_data/reviews_photos.csv');
let writeStream = fs.createWriteStream('./parsed_data/reviews_photos.csv');

class CSVCleaner extends Transform {
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, next) {
    for (let key in chunk) {
      //trims whitespace
      let trimKey = key.trim();
      chunk[trimKey] = chunk[key];
      if (key !== trimKey) { delete chunk[key]; }
    }

    //filters out all non-number characters
    chunk.id = chunk.id.replace(/\D/g, '');
    chunk.review_id = chunk.review_id.replace(/\D/g, '');
    // chunk.rating = chunk.rating.replace(/\D/g, '');

    //convert the date to a string in the format that can be used with 'timestamp' data type in postgreSQL
    // let date = new Date(parseInt(chunk.date));
    // let dateString = date.toISOString().slice(0, 19).replace('T', ' ');

    // chunk.date = dateString;

    //uses our csvStringifier to turn our chunk into a csv string
    chunk = csvStringifier.stringifyRecords([chunk]);

    let commaCount = 0;
    let quoteInsertIndex;
    for (let i = 0; i < chunk.length; i++) {
      if (chunk[i] === ',') {
        commaCount++;
        if (commaCount === 2) {
          quoteInsertIndex = i + 1;
        }
      }
    }

    let text = chunk.slice(0, quoteInsertIndex) + '"' + chunk.slice(quoteInsertIndex).trim();
    let result = text.concat(`"\n`);

    this.push(result);
    next();
  }
}

const transformer = new CSVCleaner({ writableObjectMode: true });
//write header
writeStream.write(csvStringifier.getHeaderString());
readStream
  .pipe(csv())
  .pipe(transformer)
  .pipe(writeStream)
  .on('finish', () => { console.log('finished'); });