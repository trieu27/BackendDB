const mongoose = require('mongoose');

mongoURI = 'mongodb+srv://admin:admin123@mycluster-ox3g5.gcp.mongodb.net/ThongTinDuLichHP?retryWrites=true&w=majority';

const db = mongoURI;

// Connect to MongoDB

mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

module.exports = mongoURI;


require('../discover/cuisine');
require('../discover/event');
require('../discover/experience');
require('../discover/restaurant');
require('../discover/shopping');
require('../discover/touristDestination');
require('../other/atm');
require('../other/customerSupport');
require('../other/HaiPhong');
require('../other/review');
require('../other/serai');
require('../service/entertainment');
require('../service/hotel');
require('../service/tour');
require('../service/transport');
require('./users');
require('./type');
require('./typeDetail');



/*mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);

mongoose.connect('mongodb://localhost:27017/TravelDB', { useNewUrlParser: true }, function (err) {
    if (!err) {
        console.log('MongoDB Connection Succeeded')
    }
    else {
        console.log('Error in DB connection : ' + err)
    }
});
*/


