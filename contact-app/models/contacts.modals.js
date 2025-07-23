import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'
const contactsSchema = mongoose.Schema({
first_name: {
    type: String
},
last_name: {
    type: String
},
email: {
    type: String
},
phone: {
    type: String
},
address: {
    type: String
},

})
contactsSchema.plugin(mongoosePaginate)
const contact = mongoose.model("Contact", contactsSchema)
export default contact; // Export the contact model for use in other files