const express = require('express');
var router = express.Router();

// Import handicraft modules
const cmdUser = require('./users');
const cmdType = require('./typeController');
const cmdCuisine = require('../discover/cuisineController');
const cmdEvent = require('../discover/eventController');
const cmdExperience = require('../discover/experienceController');
const cmdRestaurant = require('../discover/restaurantController');
const cmdShopping = require('../discover/shoppingController');
const cmdDestination = require('../discover/touristDestinationController');
const cmdATM = require('../other/atmController');
const cmdCustomer = require('../other/customerSupportController');
const cmdHP = require('../other/HaiPhongController');
const cmdReview = require('../other/reviewController');
const cmdSerai = require('../other/seraiController');
const cmdEntertainment = require('../service/entertainmentController');
const cmdHotel = require('../service/hotelController');
const cmdTour = require('../service/tourController');
const cmdTransport = require('../service/transportController');


router.get('/', ensureAuthenticated, function (req, res) {
    res.render('begin/index');

});

router.get('/dashboard', ensureAuthenticated, async function (req, res) {
    // for cuisine collection
    const cuisineCount = await cmdCuisine.cuisineCount();
    const cuisineGetNewest = await cmdCuisine.cuisineGetNewest();
    const cuisineGetOldest = await cmdCuisine.cuisineGetOldest();

    // for event collection
    const eventCount = await cmdEvent.eventCount();
    const eventGetNewest = await cmdEvent.eventGetNewest();
    const eventGetOldest = await cmdEvent.eventGetOldest();

    // for experience collection
    const experienceCount = await cmdExperience.experienceCount();
    const experienceGetNewest = await cmdExperience.experienceGetNewest();
    const experienceGetOldest = await cmdExperience.experienceGetOldest();

    // for restaurant collection
    const restaurantCount = await cmdRestaurant.restaurantCount();
    const restaurantGetNewest = await cmdRestaurant.restaurantGetNewest();
    const restaurantGetOldest = await cmdRestaurant.restaurantGetOldest();

    // for shopping collection
    const shoppingCount = await cmdShopping.shoppingCount();
    const shoppingGetNewest = await cmdShopping.shoppingGetNewest();
    const shoppingGetOldest = await cmdShopping.shoppingGetOldest();

    // for touristDestination collection
    const destinationCount = await cmdDestination.destinationCount();
    const destinationGetNewest = await cmdDestination.destinationGetNewest();
    const destinationGetOldest = await cmdDestination.destinationGetOldest();

    // for atm collection
    const atmCount = await cmdATM.atmCount();
    const atmGetNewest = await cmdATM.atmGetNewest();
    const atmGetOldest = await cmdATM.atmGetOldest();

    //for customerSupport collection
    const customerCount = await cmdCustomer.customerSupportCount();
    const customerGetNewest = await cmdCustomer.customerSupportGetNewest();
    const customerGetOldest = await cmdCustomer.customerSupportGetOldest();

    //for HaiPhong collection
    const hpCount = await cmdHP.HaiPhongCount();
    const hpGetNewest = await cmdHP.HaiPhongGetNewest();
    const hpGetOldest = await cmdHP.HaiPhongGetOldest();

    // for review collection
    const reviewCount = await cmdReview.reviewCount();
    const reviewGetNewest = await cmdReview.reviewGetNewest();
    const reviewGetOldest = await cmdReview.reviewGetOldest();

    // for serai collection
    const seraiCount = await cmdSerai.seraiCount();
    const seraiGetNewest = await cmdSerai.seraiGetNewest();
    const seraiGetOldest = await cmdSerai.seraiGetOldest();

    // for entertainment collection
    const entertainmentCount = await cmdEntertainment.entertainmentCount();
    const entertainmentGetNewest = await cmdEntertainment.entertainmentGetNewest();
    const entertainmentGetOldest = await cmdEntertainment.entertainmentGetOldest();

    // for hotel collection
    const hotelCount = await cmdHotel.hotelCount();
    const hotelGetNewest = await cmdHotel.hotelGetNewest();
    const hotelGetOldest = await cmdHotel.hotelGetOldest();

    // for tour collection
    const tourCount = await cmdTour.tourCount();
    const tourGetNewest = await cmdTour.tourGetNewest();
    const tourGetOldest = await cmdTour.tourGetOldest();

    // for transport collection
    const transportCount = await cmdTransport.transportCount();
    const transportGetNewest = await cmdTransport.transportGetNewest();
    const transportGetOldest = await cmdTransport.transportGetOldest();

    // for type collection
    const typeCount = await cmdType.typeCount();
    const typeGetNewest = await cmdType.typeGetNewest();
    const typeGetOldest = await cmdType.typeGetOldest();

    // for users
    const userCount = await cmdUser.userCount();
    const userGetNewest = await cmdUser.userGetNewest();
    const userGetOldest = await cmdUser.userGetOldest();

    res.render('begin/dashboard', {
        // for cuisine collection
        cuisineCount: cuisineCount,
        cuisineGetNewest: cuisineGetNewest,
        cuisineGetOldest: cuisineGetOldest,

        // for event collection
        eventCount: eventCount,
        eventGetNewest: eventGetNewest,
        eventGetOldest: eventGetOldest,

        // for experience collection
        experienceCount: experienceCount,
        experienceGetNewest: experienceGetNewest,
        experienceGetOldest: experienceGetOldest,

        // for restaurant collection
        restaurantCount: restaurantCount,
        restaurantGetNewest: restaurantGetNewest,
        restaurantGetOldest: restaurantGetOldest,

        // for shopping collection
        shoppingCount: shoppingCount,
        shoppingGetNewest: shoppingGetNewest,
        shoppingGetOldest: shoppingGetOldest,

        // for touristDestination collection
        destinationCount: destinationCount,
        destinationGetNewest: destinationGetNewest,
        destinationGetOldest: destinationGetOldest,

        // for atm collection
        atmCount: atmCount,
        atmGetNewest: atmGetNewest,
        atmGetOldest: atmGetOldest,

        //for customerSupport collection
        customerCount: customerCount,
        customerGetNewest: customerGetNewest,
        customerGetOldest: customerGetOldest,

        //for HaiPhong collection
        hpCount: hpCount,
        hpGetNewest: hpGetNewest,
        hpGetOldest: hpGetOldest,

        //for review collection
        reviewCount: reviewCount,
        reviewGetNewest: reviewGetNewest,
        reviewGetOldest: reviewGetOldest,

        //for serai collection
        seraiCount: seraiCount,
        seraiGetNewest: seraiGetNewest,
        seraiGetOldest: seraiGetOldest,

        //for entertainment collection
        entertainmentCount: entertainmentCount,
        entertainmentGetNewest: entertainmentGetNewest,
        entertainmentGetOldest: entertainmentGetOldest,

        //for hotel collection
        hotelCount: hotelCount,
        hotelGetNewest: hotelGetNewest,
        hotelGetOldest: hotelGetOldest,

        //for tour collection
        tourCount: tourCount,
        tourGetNewest: tourGetNewest,
        tourGetOldest: tourGetOldest,

        //for transport collection
        transportCount: transportCount,
        transportGetNewest: transportGetNewest,
        transportGetOldest: transportGetOldest,

        //for type collection
        typeCount: typeCount,
        typeGetNewest: typeGetNewest,
        typeGetOldest: typeGetOldest,

        //for users
        userCount: userCount,
        userGetNewest: userGetNewest,
        userGetOldest: userGetOldest,
    });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {

        res.redirect('/users/login');
    }
}


module.exports = router;

