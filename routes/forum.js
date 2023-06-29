const express = require("express")
const router = express.Router();
const db = require("../models/database")

const fs = require('fs')
require('dotenv').config();

router.get('/TopicList', async (request, response,) => {
    //const {lecture,courseName,programme,semester,level} = request.body;   
    // console.log('Displaying Topic List');
    //const topic_info=[];
    let sql = `SELECT * FROM Topic`;
    const topic_names = await db.promise().query(sql)      //db.query(sql);
    response.send(topic_names[0]);
});

router.get('/TopicComments/:topicID', async (request, response,) => {
    const { topicID } = request.params;
    // console.log("Displaying a Topic's comment");
    const topic_info = [];
    let sql = `SELECT * FROM Topic WHERE topicID= ?`;
    const topic_names = await db.promise().query(sql, [topicID])      //db.query(sql);
    topic_info[0] = topic_names[0]
    sql = `SELECT * FROM MSG WHERE topicID= ?`;
    const topic_comment = await db.promise().query(sql, [topicID])
    topic_info[1] = topic_comment[0]
    response.send(topic_info);
});

router.post('/reply/:topicID/:username/:createdAt/:parentId/:userId', async (request, response,) => {
    const { topicID, username, createdAt, parentId, userId } = request.params;
    const { comments } = request.body
    const msg = `${comments}`;
    // console.log("Replying a topic");
    //const topic_reply=[];
    let sql = `INSERT INTO MSG (body,username,createdAt,topicID,parentId, userId) VALUES (?,?,?,?,?,?)`;
    const topic_names = await db.promise().query(sql, [msg, username, createdAt, topicID, parentId, userId])      //db.query(sql);
    //topic_info[0]=topic_names[0]
    sql = `SELECT * FROM MSG WHERE topicID= ? AND username=?`;
    const topic_reply = await db.promise().query(sql, [topicID, username])
    //topic_info[1]=topic_comment[0]
    response.send(topic_reply[0]);
});

router.post('/createTopic/:topicID/:author/:createdAt/:userID', async (request, response,) => {
    const { topicID, author, createdAt, userID } = request.params;
    const { Topic, summary } = request.body
    const topicName = `${Topic}`
    const summaryText = `${summary}`;
    // console.log("Creating a topic");
    //const topic_reply=[];
    let sql = `INSERT INTO Topic (Topic,summary,author,createdAt,topicID,userID) VALUES (?,?,?,?,?,?)`;
    const topic_names = await db.promise().query(sql, [topicName, summaryText, author, createdAt, topicID, userID])      //db.query(sql);
    //topic_info[0]=topic_names[0]
    // sql = `SELECT * FROM Topic WHERE topicID= ? AND username=?`;
    // const topic_reply= await db.promise().query(sql,[topicID,username])
    //topic_info[1]=topic_comment[0]
    response.send('Topic Created');
});

router.post('/delete/:id', async (request, response,) => {
    const { id } = request.params;
    // console.log("Deleting a message");
    let sql = `DELETE FROM MSG WHERE id= ?`;
    const del_msg = await db.promise().query(sql, [id])
    response.send('Deletion Success');
});

router.post('/edit/:id', async (request, response,) => {
    const { id } = request.params;
    const { comments } = request.body
    const editMsg = `${comments}`;
    // console.log("Editing a message");
    let sql = `UPDATE MSG SET body=? WHERE id= ?`;
    console.log(sql)
    const del_msg = await db.promise().query(sql, [editMsg, id])
    response.send('Edit Success');
});
module.exports = router;