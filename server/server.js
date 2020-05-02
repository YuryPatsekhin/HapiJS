'use strict';

const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');
const Joi = require('@hapi/joi');
const ObjectId = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;

const url = "mongodb://localhost:27017";

let db;

MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
    db = client.db('my');
});


const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    country: Joi.string().min(3).max(30).required(),
    age: Joi.number().integer().required(),
    _id: Joi.string(),
});

const getFilteredParams = (params) => {
    const filteredParams = {}
    Object.keys(params).forEach(el => {
        if (params[el] !== '') {
            filteredParams[el] = params[el];
        };
    });

    return filteredParams;
}

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: '127.0.0.1',
        routes: {
            cors: {
                origin: ['http://localhost:8080']
            },
        },
    });

    server.route({
        method: 'GET',
        path: '/load',
        handler: (request, h) => {
            return new Promise((resolve, reject) => {
                const params = request.query;
                const filteredParams = getFilteredParams(params);
                db.collection('users').find(filteredParams).toArray((err, result) => {
                    if (err || result.length === 0) {
                        const error = Boom.notFound('not found');
                        reject(error)
                    };
                    resolve(
                        h.response(result));
                });
            });
        },
    });

    server.route({
        method: 'POST',
        path: '/',
        handler: (request, h) => {
            const obj = request.payload;
            const { error } = schema.validate(obj);
            if (error) {
                const validationError = Boom.badRequest(error);
                return validationError;
            } else {
                try {
                    db.collection('users').insertOne(obj);
                    return h.response(JSON.stringify({ message: 'Success' })).code(201);
                } catch (e) {
                    return Boom.badRequest();
                }
            };
        },
    });

    server.route({
        method: 'PUT',
        path: '/',
        handler: (request, h) => {
            const obj = request.payload;
            const { error } = schema.validate(obj);
            if (error) {
                const validationError = Boom.badRequest(error);
                return validationError;
            } else {
                const _id = obj._id;
                const dataForUpdate = {};
                Object.keys(obj).forEach(key => {
                    if (key !== '_id') {
                        dataForUpdate[key] = obj[key];
                    };
                });
                db.collection('users').updateOne({ _id: ObjectId(_id) }, { $set: dataForUpdate });
                return h.response().code(200);
            };
        },
    });

    server.route({
        method: 'DELETE',
        path: '/',
        handler: (request, h) => {
            const id = request.payload;
            try {
                db.collection('users').deleteOne({ _id: ObjectId(id) });
                return h.response().code(200);
            } catch (e) {
                return Boom.badRequest('Failed to delete item.');
            };
        },
    });

    await server.start();
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
