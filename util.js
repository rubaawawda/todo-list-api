const validateItem = (item) => {
  const permitted = {
    status: ['pending', 'done']
  };

  const invalid = (
    !item ||
    !item.id ||
    !item.description ||
    !permitted.status.includes(item.status)
  );

  return !invalid;
};

export default {
  validateItem
};