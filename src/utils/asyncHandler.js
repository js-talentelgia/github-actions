const asyncHandler = (requestHandler) => {
        return async (req, res, next) => {
            await Promise.resolve(requestHandler(req, res, next)).catch
            ((err) => next())
        }}

export { asyncHandler }

// const asyncHandler = () => {}

// const asyncHandler = (fun) => (req,res) = {}

// const asyncHandler = (fun) => async () = {}

// const asyncHandler = (fu) => async (req, res ,next) => {

//     try {
//         await fn(req, res, next);
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })    
//     }
// }