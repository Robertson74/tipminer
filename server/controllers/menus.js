﻿var Menu = require('mongoose').model('Menu');

exports.getMenus = function (req, res) {
    var select = req.query.select || '_id title subtitle footer';
    if (req.query.select === "all")
    {
        
        select = "";
        
    }
    
        Menu.find({ company: req.user.company },select).exec(function (err, collection) {
        // should we be stripping data from the response...company ids that could be used for wrong purposes?
        res.send(collection);});
    
    
    


};

exports.getMenuById = function (req, res) {

    Menu.findOne({ _id: req.params.id, company: req.user.company }).exec(function (err, menu) {
        // attach menu schema info
        res.send(menu);
    });

};

exports.createMenu = function (req, res){
    var menuData = req.body;
    menuData.company = req.user.company;
    Menu.create(menuData, function (err, menu) {
        if (err) {
            res.status(400);
            return res.send({ reason: err.toString() });
        }
        res.send(menu.toObject());
    });
};
exports.updateMenu = function (req, res){
    //mongoose doesn't like these keys
    delete req.body._id;
    delete req.body.$promise;
    console.log(req.body);
    //kick off the update here
    Menu.findByIdAndUpdate({ _id: req.params.id }, req.body, function (err, menu) {
        if (err) {
            console.log(err);
            res.status(400);
            return res.send({ reason: err.toString() });
        }
        res.send(menu.toObject());
    });
};
exports.deleteMenu = function (req, res){
    Menu.remove({ _id: req.params.id }, function (err) {
        if (err) {
            res.status(400);
            return res.send({ reason: err.toString() });
        }
        res.send(204);
    });
};
exports.cloneMenu = function (req, res){
    res.send('not implemented');
};
