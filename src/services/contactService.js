const Contact = require('../models/contact.model');

const findContactById = async ({ contactId }) => {
  const contact = await Contact.findById(contactId);
  return contact;
};

const createContact = async ({ user, name, lastname, phone }) => {
  const contact = await Contact.create({
    user,
    name,
    lastname,
    phone,
  });
  return contact;
};

const deleteContact = async ({ contactId }) => {
  const contact = await Contact.deleteOne({ _id: contactId });
};

const searchContactsPaginated = async ({ user, filters, page }) => {
  const customLabels = {
    docs: 'contacts',
    totalDocs: 'totalContacts',
  };

  const paginationOptions = {
    page,
    limit: 10,
    customLabels,
    select: '_ID name lastname phone',
    sort: 'name',
  };
  // Fix to use like search
  Object.keys(filters).map(
    key => (filters[key] = new RegExp(filters[key], 'i'))
  );

  const contacts = await Contact.paginate(
    { ...filters, user },
    paginationOptions
  );
  return contacts;
};

module.exports = {
  createContact,
  searchContactsPaginated,
  findContactById,
  deleteContact,
};
