
'use strict';

const StateList = require('../ledger-api/statelist.js');

const SurveyQuestion = require('./question.js');

class QuestionList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.jnu.surveyquestionlist');
        this.use(SurveyQuestion);
    }

    async addQuestion(question) {
        return this.addState(question);
    }

    async getQuestion(questionKey) {
        return this.getState(questionKey);
    }

    async getQuestionsBySurveyKey(surveyKey){
        return this.getStatesByPartialKey(surveyKey);
    }

    async updateQuestion(question) {
        return this.updateState(question);
    }

    async deleteQuestion(questionKey){
        return this.deleteState(questionKey);
    }
}


module.exports = QuestionList;