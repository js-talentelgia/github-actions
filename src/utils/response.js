var message = {
    MISSING_ID: 'Please Enter Notification Id',
    DEVICE_TOKEN_ERROR: 'Device token error',
    EXPIRE_TOKEN1: 'Token Expired',
    EMAIL_ALREADY_EXIST: "Email already exist",
    USER_NOT_FOUND: "User not Found",
    ACCOUNT_ADDED: "Account add successfully",
    ACCOUNT_EXIST: "Account already exist",
    ACCOUNT_UPDATE: "Account updated sucessfully",
    LINK_EXPIRE: "Account verification link expired",
    VERIFY_EMAIL: "Please verify Your Email",
    FILTER_NOT_FOUND: "filter not found",
    GOOGLE_SIGNIN: "Email is already registered through Google.",
    EMAIL_REGISTERED_NOT_VERIFIED: "Email is already registered but not verified. Please verify your Email",
    DATA_FETCH: "Data fetch successfully",
    NOT_FOUND: "User not found",
    NOT_ACTIVE: "Sorry! Your Account is not Active.",
    EMAIL_SENT: "Email sent successfully",
    VERIFY_TOKEN: 'Reset password token verify',
    EXPIRE_TOKEN_LINK: 'Reset password token expired',
    EXPIRE_TOKEN: 'Token expired, Please login via normal form.',
    PASSWORD_RESET: 'Password reset successfully',
    CHANGE_PASSWORD: 'Password change successfully',
    PASSWORD_NOT_MATCHED: 'Passwords not matched',
    INVALID_TOKEN: "Invalid Reset token",
    INCORRECT_PASSWORD: "Incorrect password",
    LOGIN_SUCCESS: "User login successful",
    PASSWORD_SAME: "Old and new password cannot be same",
    PROFILE_UPDATE: "User profile update successfully",
    NOTIFICATION_SETTINGS_UPDATE: "Notification settings update successfully",
    AUTHENTICATION_FAILED: "Session Expired.",
    USER_DATA_UPDATED: "User data successfully updated",
    REMOVE_USER: "User remove successfully",
    REMOVE_DEPARTMENT: "Department remove successfully",
    NO_DATA_FOUND: "No data found",
    DEPARTMENT_ALREADY_EXIST: "Department already added",
    DEPARTMENT_ADDED: "Department add successfully",
    DEPARTMENT_DATA_UPDATED: "Department data successfully updated",
    PRODUCT_EXIST: "Product already exist",
    PRODUCT_ADDED: "Product added successfully",
    DELETE_PRODUCT: "Product deleted successfully",
    UPDATE_DATA: "Data updated successfully",
    UPDATE_PRODUCT: "Product updated successfully",
    PRODUCT_NOT_FOUND: "Product not found",
    TAG_EXIST: "Tag already exist",
    TAG_ADDED: "Tag updated successfully",
    LEAD_NOT_EXIST: "Lead not exist. Please enter valid product lead",
    // TITLE_ALREADY_EXIST: "title already exist",
    DELETE_SUCCESS: "Record deleted successfully!",
    TITLE_ALREADY_EXIST: "Title already exist",
    JIRA_SERVER_EXIST: 'Jira server url exist',
    NO_JIRA_SERVER_FOUND: 'Jira server url not exist',
    NO_JIRA_TYPE_FOUND: 'Jira issue Type not found',
    JIRA_ACCOUNT_EXPIRE: 'Your jira account expire',
    ADD_PROJECT: "Project added successfully",
    ADD_INSIGHT: "Insight added successfully",
    PROJECT_NOT_FOUND: "Project not found",
    DELETE_INTEGRATION: 'Integration deleted successfully',
    INTEGRATION_DATA_UPDATED: 'Integration updated successfully ',
    PROJECT_EXIST: 'Project name already exist',
    PROJECT_MAPPED: 'Project mapped successfully',
    PROJECT_UPDATE: 'Project updated successfully',
    INSIGHT_UPDATE: 'Insight updated successfully',
    PROJECT_DELETED: 'Project deleted successfully',
    FOCUSAREA_NOT_FOUND: 'Focus area not found for this product',
    PROJECT_NOT_FOUND: 'Project not found',
    INSIGHT_NOT_FOUND: 'Insight not found',
    COMMENT_NOT_FOUND: 'Comment not found',
    FEEDBACK_NOT_FOUND: 'Feedback not found',
    INSIGHT_NOT_FOUND: 'Insight not found',
    REQUIREMENT_NOT_FOUND: 'Requirement not found, Please check requirement id and project id',
    ITEM_NOT_FOUND: 'Item not found, Please check Item id and product id',
    COMMENT_UPDATED: "Comment updated successfully",
    NO_COMMENT_ACCESS: "You can't update this comment, user id not matched",
    COMMENT_DELETED: "Comment deleted successfully",
    FEEDBACK_DELETED: "Feedback deleted successfully",
    INSIGHT_DELETED: "Insight deleted successfully",
    REQUIREMENT_DELETED: "Requirement deleted successfully",
    REQUIREMENT_FOUND: "Requirement fetched successfully",
    ATTACHMENT_DELETED: "Attachment deleted successfully",
    ATTACHMENT_NOT_FOUND: 'Attachment not found',
    IDEA_ADDED: 'Idea added successfully',
    DATA_NOT_FOUND: "Data not found",
    IDEA_UPDATED: "Idea updated successfully",
    PROMOTE_AS_PROJECT: "Idea promoted as project successfully",
    IDEA_NOT_FOUND: "Idea not found",
    IDEA_ALREADY_READ: "Idea is already read by login user",
    FILE_NOT_FOUND: "File not found",
    ARCHIVE_DONE: "Archive successfully",
    UNARCHIVE_DONE: "Unarchive successfully",
    TYPE_NOT_MATCH: "Type not matched",
    ADD_STREAM: "WorkStream added successfully",
    LABEL_STREAM: "Color Label added successfully",
    STREAM_NOT_FOUND: "Workstream not found",
    UPDATE_STREAM: "Workstream updated successfully",
    DELETE_STREAM: "Workstream deleted successfylly",
    PLAN_ADD: "Plan added successfully",
    PLAN_UPDATE: 'Plan updated successfully',
    VERSION_NOT_FOUND: "Version not found",
    PLAN_NOT_FOUND: "Plan not found",
    ADD_VERSION: "Version added successfully",
    ACCOUNT_NOT_FOUND: "Account is not active",
    REVERT_SUCCESSFULL: "Version reverted Successfully",
    NAME_EXIST: "Filter name already exist",
    FILTER_VIEW_ADD: "Filter view added successfully",
    FILTER_VIEW_EDIT: "Filter view updated successfully",
    VERSION_UPDATE: "Version Updated successfully",
    DELETE_PROJECT: "Project Deleted Successfully",
    STREAM_DELETE: "Stream Deleted Successfully",
    NO_SHARE_ACCESS: "Shareable link is not enabled",
    DELETE_FILTER: "Filter Deleted Successfully",
    ADMIN_ADD_USER_ERROR: "Sorry that email address already is used in another account. Please use a different email address",
    ADD_SECTION: "Section added successfully",
    EDIT_SECTION: "Section edited successfully",
    DELETE_SECTION: "Section deleted successfully",
    VOTE_ADD: "Vote added successfully",
    ITEM_ADD: "Allowed only 100 items for basic plan",
    error: (err) => {
        let response = {
            statusCode: 400,
            error: true,
            success: false,
            message: err,
            data: null
        };
        return response;
    },
    authorisedError: (err) => {
        let response = {
            statusCode: 401,
            error: true,
            success: false,
            message: err,
            data: null
        };
        return response;
    },
    authorisedError1: (err, data) => {
        let response = {
            statusCode: 401,
            error: true,
            success: false,
            message: err,
            data: data
        };
        return response;
    },
    sendError: (err) => {
        let response = {
            statusCode: 412,
            message: err,
            error: true,
            errorType: "VALIDATION_ERROR",
            data: null,
            success: false
        };
        return response;
    },
    success: (data, message) => {
        let response = {
            statusCode: 200,
            error: false,
            success: true,
            message: message,
            data: data,
        };
        return response;
    },
    success1: (data, message, data1) => {
        let response = {
            statusCode: 200,
            error: false,
            success: true,
            message: message,
            data: data,
            data1: data1
        };
        return response;
    },
    successWithToken: (data, message, token) => {
        let response = {
            statusCode: 200,
            error: false,
            success: true,
            message: message,
            data: data,
            token
        };
        return response;
    },
}

export const response = message