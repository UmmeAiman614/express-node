import express from 'express';

import {getContacts, showContact,  addContact, addContactPage, updateContact, updateContactPage, deleteContact} from '../controller/contacts-controller.js';
const router = express.Router();

router.get('/', getContacts)

router.get('/show-contact/:id', showContact); // Route to show a specific contact

router.get('/add-contact', addContact); // Route to render the add contact form

router.post('/add-contact', addContactPage);

router.get('/update-contact/:id', updateContact);

router.post('/update-contact/:id', updateContactPage);

router.get('/delete-contact/:id', deleteContact); // Route to delete a contact

export default router; // Export the router to use in the main app