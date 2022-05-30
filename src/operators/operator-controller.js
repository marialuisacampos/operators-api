const {
  registerNewOperatorOnDatabase,
  verifyExistentOperatorOnDatabase,
  deleteOperatorOnDatabase,
  searchAllOperatorsOnDatabase,
  updateOperatorOnDatabase,
} = require('./operator-service');

const registerNewOperator = async (req, res) => {
  try {
    const newOperator = req.body;
    const { ansRegister } = newOperator;
    const verifyExistenceOfOperator = await verifyExistentOperatorOnDatabase(ansRegister);

    if (verifyExistenceOfOperator) {
      return res.status(400).json({ message: `ANS Register ${ansRegister} already exists` });
    } else {
      const operatorRegistered = await registerNewOperatorOnDatabase(newOperator);

      return res.status(200).json({
        message: "Operator registered.",
        operator: operatorRegistered,
      });
    };
  } catch (error) {
    return res.status(500).send(error);
  };
};

const searchAllOperators = async (req, res) => {
  try {
    const operators = await searchAllOperatorsOnDatabase();

    if (operators.length === 0) {
      return res.status(400).json({ message: 'There is no operators on database.' });
    }
    return res.status(200).json(operators);
  } catch (error) {
    return res.status(404).json({ 
      message: 'Error finding operators',
      error,
     });
  };
};

const updateOperator = async (req, res) => {
  try {
    const ansRegisterToUpdate = req.params.ansRegister;
    const operatorToUpdate = req.body;
    const verifyExistenceOfOperator = await verifyExistentOperatorOnDatabase(ansRegisterToUpdate);

    if(verifyExistenceOfOperator) {
      await updateOperatorOnDatabase(ansRegisterToUpdate, operatorToUpdate);
      return res.status(200).json({ message: `Operator with ANS Register ${ansRegisterToUpdate} updated.` });
    }
    return res.status(400).json({ message: `ANS Register ${ansRegisterToUpdate} does not exist.` });
  } catch (error) {
    return res.status(404).json({
      message: 'Error finding operators.',
      error,
    });
  };
};

const deleteOperator = async (req, res) => {
  try {
    const { ansRegister } = req.params;

    const verifyExistenceOfOperator = await verifyExistentOperatorOnDatabase(ansRegister);

    if(verifyExistenceOfOperator)  {
      await deleteOperatorOnDatabase(ansRegister);
      return res.status(200).json({ message: `Operator with ANS Register ${ansRegister} deleted` });
    } else {
      return res.status(500).json({ message: 'ANS Register does not exist.' });
    };
  } catch(error) {
    return res.status(404).json({
      message: 'Error deleting operator.',
      error,
    });
  };
};

module.exports = {
  registerNewOperator,
  deleteOperator,
  searchAllOperators,
  updateOperator,
};