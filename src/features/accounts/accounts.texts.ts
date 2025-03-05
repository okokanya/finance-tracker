const texts = {
  accounts: {
    title: 'Счета',
    totalAmount: 'Общая сумма всех счетов',
    addAccount: 'Добавить счет',
  },
  accountCard: {
    transaction: 'Изменение баланса',
    manage: 'Управление счетом',
  },
  accountParams: {
    typeTitles: ['Обычный', 'Накопительный', 'Долговой — Я должен', 'Долговой — Мне должны'],
    nameTitle: 'Название счета',
    namePlaceholder: 'Основной счет',
    typeTitle: 'Тип счета',
    descriptionTitle: 'Описание счета',
    descriptionPlaceholder: 'Основной счет для повседневных операций',
    balanceTitle: 'Баланс',
    balancePlaceholder: '10 500 ₽',
  },
  addAccount: {
    action: {
      title: 'Создание нового счета',
      create: 'Создать',
    },
    repeatAction: {
      title: 'Ошибка создания нового счета',
      description: 'Что-то пошло не так при создании нового счета. Пожалуйста, попробуйте снова.',
    },
  },
  manageAccount: {
    action: {
      title: 'Управление счетом:',
      updateAccount: 'Сохранить изменения',
      deleteAccount: 'Удалить счет',
      archiveAccount: 'Архивировать счет',
      accountOperations: 'Операции по счету',
      noTransactions: 'По этому счету не найдено операций',
      transactionsError: 'Во время загрузки операций по счету произошла ошибка',
    },
    repeatUpdateAction: {
      title: 'Ошибка обновления счета',
      description: 'Что-то пошло не так при обновлении счета. Пожалуйста, попробуйте снова.',
    },
    repeatDeleteAction: {
      title: 'Ошибка удаления счета',
      description: 'Что-то пошло не так при удалении счета. Пожалуйста, попробуйте снова.',
    },
    repeatArchiveAction: {
      title: 'Ошибка архивирования счета',
      description: 'Что-то пошло не так при архивировании счета. Пожалуйста, попробуйте снова.',
    },
  },
  repeat: 'Повторить',
  cancel: 'Отменить',
};

export default texts;
