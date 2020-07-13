const SupportRequest =  require('../models/schema/supportRequest.model')
const ApiError = require('../utils/ApiError')
const httpStatus = require('http-status')
const { requestStatus } = require('../models/config')


/**
 * Create a SupportRequest
 * @param {Object} supportRequestBody
 * @returns {Promise<User>}
 */
const createSupportRequest = async (data, user) => {
    const title = data.title
    const exists = await SupportRequest.findOne({title: title, userId: user._id})
    if (exists){
        throw new  ApiError(httpStatus.BAD_REQUEST,'Support request already exists')
    }
    data.userId = user.id
    data.requestStatus = requestStatus.pending
    return  SupportRequest.create(data)
}

const getSupportRequestById = async (id) => {
    return await SupportRequest.findById(id)
}

const getSupportRequestByTitle = async (title) => {
    return await SupportRequest.findOne({title: title})
}

const querySupportRequests  = async () => {
    return await SupportRequest.find()
}

const updateSupportRequestById = async  (requestId, req) => {
    const request = await SupportRequest.findById(requestId)
    if (!request){
        throw new ApiError(httpStatus.NOT_FOUND, "Support request not found")
    }
    if (request._id !== req.user){
        throw new ApiError(httpStatus.FORBIDDEN, "Sorry, you can only modify a support request you created")
    }
    Object.assign(request, req.body)
    request.save()
    console.log(`req::::;${ request._id}`)

    return request
}

module.exports = {
    createSupportRequest,
    getSupportRequestById,
    getSupportRequestByTitle,
    querySupportRequests,
    updateSupportRequestById
}