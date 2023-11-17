const express = require('express');
const comments = express.Router();

const CommentModel = require('../modules/comments')

comments.get('/products/:productId/comments', async (req, res) => {
    const productId = req.params.id;


    try {

        const comment = await CommentModel.find({ productId}).populate('client')
        if (!comment) {
            return res.status(404)({
                statuscode: 404,
                message: 'The comment does not exist'
            })
        } 
        res.status(200).send({
            statuscode: 200,
            message: "comment found",
            comment
        })
    } catch (err) {
        res.status(500).send({
            statuscode: 500,
            message: "errore interno del server"
        })
    }

})

comments.post('/products/:productId/comments/create', async (req, res) => {
    const productId = req.params.productId;
    const newComment = await CommentModel({
        comment: req.body.comment,
        client: req.body.client,
        product: productId
    });


    try {
        const commentNew = await newComment.save()
        res.status(200).send({
            statuscode: 200,
            message: "comment added successfully",
            comment: commentNew
        })

    } catch (err) {
        console.error(err);
        res.status(400).send({
            statuscode: 400,
            message: "Errore interno del server",
            error: err
        });
    }



})

comments.patch('/comments/update/:id', async (req, res) => {
    const { id } = req.params;
    const commentExists = await CommentModel.findById(id);

    if (!commentExists) {
        return res.status(404)({
            statuscode: 404,
            message: 'The comment does not exist'
        })
    }
    try {
        const commentToUpdate = req.body;
        const options = {
            new: true
        }
        const result = await CommentModel.findByIdAndUpdate(id, commentToUpdate, options)

        res.status(200).send({
            statuscode: 200,
            message: 'Comment updated successfully',
            result: result
        })
    } catch (err) {
        res.status(500).send({
            statuscode: 500,
            message: "errore interno del server",
            err
        })
    }
})

comments.get('/comments/:id', async (req, res) => {
    const { id } = req.params;
    const commentExists = await CommentModel.findById(id);

    if (!commentExists) {
        return res.status(404).json({
            statuscode: 404,
            message: 'The comment does not exist'
        })
    }
    try {
        res.status(200).json({
            statuscode: 200,
            message: 'Comment updated successfully',
            comment: commentExists
        })
    } catch (err) {
        res.status(500).send({
            statuscode: 500,
            message: "errore interno del server",
            err
        })
    }


})

comments.delete('/comments/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const commentToDelete = await CommentModel.findByIdAndDelete(id);
        if (!commentToDelete) {
            return res.status(404).send({
                statuscode: 404,
                message: "comment not found"
            });
        }

        res.status(200).send({
            statuscode: 200,
            message: "comment deleted",
            commentToDelete
        })
    } catch (err) {
        res.status(500).send({
            statuscode: 500,
            message: "errore interno del server",
            err
        })
    }

})



module.exports = comments;