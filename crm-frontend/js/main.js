;(function () {
  // doom element
  const body = document.querySelector('.body')
  const container = document.getElementById('container')
  const dialogBackground = document.getElementById('myBackground')
  const dialogModalWindow = document.getElementById('myDialog')
  const btnAddClient = document.getElementById('addUser')
  const autoComplete = document.getElementById('autocomplete')
  const searchClient = document.getElementById('search')
  const logo = document.getElementById('logo')
  let tableUsers = document.querySelector('.table-users')
  const titleId = document.getElementById('title__id')
  const titleFullName = document.getElementById('title__fullName')
  const titleCreateDate = document.getElementById('title__create-date')
  const titleUpdateDate = document.getElementById('title__update-date')
  const waiting = document.getElementById('waiting')
  // variables for the triggered timer
  let timerIdSearch = null
  let timerIdResponse = null
  let countTimer = null
  const maxTimeResponseTheServer = 7000
  const timeResponse = 1
  const timeResponseTheSearch = 300
  let complete = []
  let valueForSelect = []
  let condition = null
  let serverResponse = null
  let arrayTextError = []
  // url server
  const urlServer = 'http://localhost:3000'
  // count contacts
  let countContacts = 0
  // masked https://github.com/RobinHerbots/Inputmask
  //===============================================================================
  //  ------------  Processing button pressing ------------
  btnAddClient.addEventListener('click', () => {
    modalWindowAddClient()
  })
  //===============================================================================
  // ------------   Processing request ------------
  search.addEventListener('input', () => {
    searchInform()
  })
  //===============================================================================
  // ------------   If there is hash  ------------
  window.onhashchange = function () {
    openWindowHash()
  }
  //===============================================================================
  //  ------------  Positioning of the element ------------
  function positionElement() {
    let widthWindow = window.screen.width
    btnAddClient.style.marginLeft = widthWindow / 2 - 142 + 'px'
    const hasHorScroll = body.scrollWidth > body.clientWidth
    const userDevice = navigator.userAgent.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i,
    )
    if (hasHorScroll || !!userDevice) {
      logo.style.marginLeft = widthWindow / 2 + this.scrollX - 50 + 'px'
      logo.style.marginRight = '0px'
    } else {
      logo.style.marginLeft = '20px'
      logo.style.marginRight = '30px'
    }
  }
  //===============================================================================
  // ------------   Opening a modal window on hash ------------
  function openWindowHash() {
    let hashSearch = location.hash
    if (hashSearch.includes('id')) {
      let id = hashSearch.slice(hashSearch.indexOf('id') + 2)
      //
      spinnerCondition(true)
      modalWindowEditClient(id, false)
    }
  }
  //===============================================================================
  //  ------------  function for close  the modal window ------------
  function closeModalWindow() {
    let dialog = dialogModalWindow.querySelector('.dialog__wrap')
    dialog.classList.remove('dialog__wrap--active')
    dialogBackground.classList.remove('fon-active')
    body.classList.remove('body-scrolling')
    setTimeout(() => {
      removeChildElement(dialog)
    }, 500)
  }
  //===============================================================================
  // ------------   function for visible the modal window ------------
  function visibleModalWindow(dialog) {
    dialogModalWindow.append(dialog.dialogWrap)
    dialogBackground.classList.add('fon-active')
    setTimeout(() => {
      dialog.dialogWrap.classList.add('dialog__wrap--active')
    }, 200)
    body.classList.add('body-scrolling')
  }
  //========================================================================================
  // ------ destroy modal windows before push wrapper -------
  dialogModalWindow.addEventListener('click', (element) => {
    if (element.target == dialogModalWindow) {
      // close the modal window
      closeModalWindow()
    }
  })
  //========================================================================================
  // -----     Creating a dialog box        --------
  function createDialogWindow() {
    let dialogWrap = document.createElement('div')
    dialogWrap.classList.add('dialog__wrap')
    let dialogHeader = document.createElement('div')
    dialogHeader.classList.add('dialog__header')
    let dialogHeaderWrap = document.createElement('div')
    dialogHeaderWrap.classList.add('dialog__header-wrap')
    let dialogTitle = document.createElement('h3')
    dialogTitle.classList.add('dialog__title')
    dialogTitle.classList.add('reset-style')
    let dialogSubtitle = document.createElement('span')
    dialogSubtitle.classList.add('dialog__subtitle')
    let btnClose = document.createElement('button')
    btnClose.classList.add('button')
    btnClose.classList.add('reset-style')
    btnClose.classList.add('dialog__button')
    btnClose.classList.add('dialog__button--close')
    btnClose.innerHTML =
      '<span class="button__line"></span><span class="button__line"></span>'
    let dialogBody = document.createElement('div')
    dialogBody.classList.add('dialog__body')
    let dialogFooter = document.createElement('div')
    dialogFooter.classList.add('dialog__footer')
    let btnBig = document.createElement('button')
    btnBig.classList.add('button')
    btnBig.classList.add('reset-style')
    btnBig.classList.add('dialog__button')
    btnBig.classList.add('dialog__button--big')
    btnBig.setAttribute('id', 'buttonBig')
    let btnLittle = document.createElement('button')
    btnLittle.classList.add('button')
    btnLittle.classList.add('reset-style')
    btnLittle.classList.add('dialog__button')
    btnLittle.classList.add('dialog__button--little')
    dialogHeaderWrap.append(dialogTitle)
    dialogHeaderWrap.append(dialogSubtitle)
    dialogHeader.append(dialogHeaderWrap)
    dialogHeader.append(btnClose)
    dialogWrap.append(dialogHeader)
    dialogWrap.append(dialogBody)
    dialogFooter.append(btnBig)
    dialogFooter.append(btnLittle)
    dialogWrap.append(dialogFooter)
    dialogModalWindow.append(dialogWrap)
    return {
      dialogWrap,
      dialogHeader,
      dialogHeaderWrap,
      dialogTitle,
      dialogSubtitle,
      btnClose,
      dialogBody,
      dialogFooter,
      btnBig,
      btnLittle,
    }
  }
  //========================================================================================
  // -------      Error conclusion              --------------
  function errorDisplay() {
    alert('Сервер не отвечает. Повторите операцию позже')
  }
  //===================================================================================================
  // ------  created element spinner  -----------
  function createSpinner() {
    let id = 'spinner-' + Math.floor(Math.random() * (1000 - 10 + 1)) + 10
    let blockSpinnerStatus = document.createElement('span')
    let blockSpinnerStatusHTML = `<span class="spinner-border spinner-border-sm text-primary" role="status" aria-hidden="true" id='${id}'></span>`
    return { blockSpinnerStatus, blockSpinnerStatusHTML, id }
  }
  //===================================================================================================
  //  ------------    enable tooltip in window  -----------
  function enableTolTips() {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]',
    )
    const tooltipList = [...tooltipTriggerList].map(
      (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl),
    )
  }
  //===================================================================================================
  //  ------------     search client in data  ---------
  function searchInform() {
    let stringSearch = search.value.trim()
    // reset values timer
    clearTimeout(timerIdSearch)
    // we are waiting finish input
    timerIdSearch = setTimeout(() => {
      // check input the data
      if (!stringSearch == '') {
        // request the server
        requestingSearchClientData(stringSearch)
        spinnerCondition(true)
        // reset values
        countTimer = 0
        // we are waiting response for the server
        timerIdResponse = setInterval(() => {
          if (serverResponse.status != null) {
            spinnerCondition(false)
            // delete the timer
            clearInterval(timerIdResponse)
            if (!printError()) {
              autoCompleteSearch(stringSearch)
            }
          }
          countTimer++
          console.log('search  ЖДУ ответа сервера countTimer = ' + countTimer)
          if (countTimer > maxTimeResponseTheServer) {
            // delete the timer
            clearInterval(timerIdResponse)
            console.log('Delete timer')
            errorDisplay()
            spinnerCondition(false)
          }
        }, timeResponse)
      } else {
        if (autoComplete.firstChild) {
          removeChildElement(autoComplete.firstChild)
          autoComplete.classList.remove('autocomplete-active')
        }
        // data from local store (no request the server)
        tableClientsCleaner()
        downloadIndex()
        enableTolTips()
      }
    }, timeResponseTheSearch)
  }
  //===================================================================================================
  // -------------   auto Complete     --------------------
  function autoCompleteSearch(searchValue) {
    valueForSelect = []
    let selectSize = 0
    if (autoComplete.firstChild) {
      removeChildElement(autoComplete.firstChild)
    }
    let select = document.createElement('select')
    select.classList.add('select')
    select.classList.add('autocomplete__select')
    autoComplete.append(select)
    searchData(serverResponse.allData, searchValue)
    deleteColorRow()
    select.addEventListener('click', (event) => {
      console.log(event.target.value)
      searchClient.value = event.target.value
      deleteColorRow()
      searchInform()
      setTimeout(() => {
        let colorElement = tableUsers.querySelectorAll('.data__client--color')
        if (colorElement.length < 2) {
          autoComplete.classList.remove('autocomplete-active')
          removeChildElement(autoComplete.firstChild)
        }
      }, 400)
    })
    if (valueForSelect.length) {
      for (let key in valueForSelect) {
        let selectOption = document.createElement('option')
        selectOption.innerText = valueForSelect[key]
        selectOption.setAttribute('value', valueForSelect[key])
        selectOption.classList.add('select__option')
        select.append(selectOption)
        selectSize++
      }
      select.setAttribute('size', selectSize)
      autoComplete.classList.add('autocomplete-active')
      colorRow()
    } else {
      if (autoComplete.firstChild) {
        autoComplete.classList.remove('autocomplete-active')
        removeChildElement(autoComplete.firstChild)
        deleteColorRow()
      }
    }
    return selectSize
  }
  //===================================================================================================
  //  ------------  Highlighting the found line ------------
  function colorRow() {
    deleteColorRow()
    let dataClient = tableUsers.querySelectorAll('.data__client')
    for (let oneObj of serverResponse.allData) {
      for (let row of dataClient) {
        let clientId = row.querySelector('.data__col-id').querySelector('p')
          .innerText
        if (oneObj.id === clientId) {
          row.classList.add('data__client--color')
        }
      }
    }
    let scrollClient = tableUsers.querySelector('.data__client--color')
    if (scrollClient) {
      tableUsers
        .querySelector('.data__client--color')
        .scrollIntoView({ behavior: 'smooth' })
    }
  }
  //===================================================================================================
  //  ------------  Removing the color of the line ------------
  function deleteColorRow() {
    let dataClient = tableUsers.querySelectorAll('.data__client')
    for (let row of dataClient) {
      if (row.classList.contains('data__client--color')) {
        row.classList.remove('data__client--color')
      }
    }
  }
  //===================================================================================================
  // ------  search "searchValue" in "allDateNew"  (recursion)  -------------
  function searchData(allDateNew, searchValue) {
    const searchValueLowCase = searchValue.toLowerCase()
    for (let index in allDateNew) {
      if (typeof allDateNew[index] === 'string') {
        let valueLowCase = allDateNew[index].toLowerCase()
        if (valueLowCase.includes(searchValueLowCase)) {
          valueForSelect.push(allDateNew[index])
          element = true
        }
      } else {
        searchData(allDateNew[index], searchValueLowCase)
      }
    }
    return valueForSelect
  }
  //===================================================================================================
  // ------------ sort data  ------------
  function sortTableClients(arrayClients, sortValue, order) {
    arrayClients.sort((prev, next) => {
      if (order > 0) {
        if (prev[sortValue] > next[sortValue]) {
          return -1
        }
        if (prev[sortValue] < next[sortValue]) {
          return 1
        }
        return 0
      } else {
        if (prev[sortValue] < next[sortValue]) {
          return -1
        }
        if (prev[sortValue] > next[sortValue]) {
          return 1
        }
        return 0
      }
    })
    return arrayClients
  }
  //===================================================================================================
  // ------------  event the push the title "Id"  ------------
  titleId.addEventListener('click', () => {
    titleId.classList.toggle('data__sort')
    if (titleId.classList.contains('data__sort')) {
      titleId.innerHTML = 'ID <span style="color: #9873FF">&#8595;</span>'
      sortTableClients(serverResponse.allData, 'id', 1)
    } else {
      titleId.innerHTML = 'ID <span style="color: #9873FF">&#8593;</span>'
      sortTableClients(serverResponse.allData, 'id', -1)
    }
    tableClientsCleaner()
    for (let searchFinish of serverResponse.allData) {
      createItem(searchFinish)
    }
    enableTolTips()
  })
  //===================================================================================================
  // ------------  event the push the title "FullName"  ------------
  titleFullName.addEventListener('click', () => {
    tableClientsCleaner()
    titleFullName.classList.toggle('data__sort')
    if (titleFullName.classList.contains('data__sort')) {
      titleFullName.innerHTML =
        'Фамилия Имя Отчество <span style="color: #9873FF">&#8595; А-Я</span>'
      sortTableClients(serverResponse.allData, 'lastName', 1)
      sortTableClients(serverResponse.allData, 'name', 1)
      sortTableClients(serverResponse.allData, 'surname', 1)
    } else {
      titleFullName.innerHTML =
        'Фамилия Имя Отчество <span style="color: #9873FF">&#8593; Я-А</span>'
      sortTableClients(serverResponse.allData, 'lasName', -1)
      sortTableClients(serverResponse.allData, 'name', -1)
      sortTableClients(serverResponse.allData, 'surname', -1)
    }
    for (let searchFinish of serverResponse.allData) {
      createItem(searchFinish)
    }
    enableTolTips()
  })
  //===================================================================================================
  // ------------   event the push the title "CreateDate"  ------------
  titleCreateDate.addEventListener('click', () => {
    tableClientsCleaner()
    titleCreateDate.classList.toggle('data__sort')
    if (titleCreateDate.classList.contains('data__sort')) {
      titleCreateDate.innerHTML =
        'Дата и время создания <span style="color: #9873FF">&#8595;</span>'
      sortTableClients(serverResponse.allData, 'createdAt', 1)
    } else {
      titleCreateDate.innerHTML =
        'Дата и время создания <span style="color: #9873FF">&#8593;</span>'
      sortTableClients(serverResponse.allData, 'createdAt', -1)
    }
    for (let searchFinish of serverResponse.allData) {
      createItem(searchFinish)
    }
    enableTolTips()
  })
  //===================================================================================================
  // ------------  event the push the title "UpdateDate"  ------------
  titleUpdateDate.addEventListener('click', () => {
    tableClientsCleaner()
    titleUpdateDate.classList.toggle('data__sort')
    if (titleUpdateDate.classList.contains('data__sort')) {
      titleUpdateDate.innerHTML =
        'Последнее изменение <span style="color: #9873FF">&#8595;</span>'
      sortTableClients(serverResponse.allData, 'updatedAt', 1)
    } else {
      titleUpdateDate.innerHTML =
        'Последнее изменение <span style="color: #9873FF">&#8593;</span>'
      sortTableClients(serverResponse.allData, 'updatedAt', -1)
    }
    for (let searchFinish of serverResponse.allData) {
      createItem(searchFinish)
    }
    enableTolTips()
  })
  //===================================================================================================
  // ------------  create wrapper for full name  ------------
  function createWrapperForFullName() {
    let fullNameWrapper = document.createElement('div')
    fullNameWrapper.classList.add('full-name__wrapper')
    let labelSurname = document.createElement('label')
    labelSurname.classList.add('full-name__label')
    labelSurname.setAttribute('for', 'surname')
    labelSurname.innerHTML = 'Фамилия<span style="color: #9873FF">*</span>'
    let surname = document.createElement('input')
    surname.classList.add('full-name__surname')
    surname.classList.add('input')
    surname.setAttribute('type', 'text')
    surname.setAttribute('name', 'surname')
    surname.setAttribute('id', 'surname')
    let labelName = document.createElement('label')
    labelName.classList.add('full-name__label')
    labelName.setAttribute('for', 'name')
    labelName.innerHTML = 'Имя<span style="color: #9873FF">*</span>'
    let name = document.createElement('input')
    name.classList.add('full-name__name')
    name.classList.add('input')
    name.setAttribute('type', 'text')
    name.setAttribute('name', 'name')
    name.setAttribute('id', 'name')
    let labelLastName = document.createElement('label')
    labelLastName.classList.add('full-name__label')
    labelLastName.setAttribute('for', 'lastName')
    labelLastName.innerText = 'Отчество'
    let lastName = document.createElement('input')
    lastName.classList.add('full-name__lastName')
    lastName.classList.add('input')
    lastName.setAttribute('type', 'text')
    lastName.setAttribute('name', 'lastName')
    lastName.setAttribute('id', 'lastName')
    fullNameWrapper.append(labelSurname)
    fullNameWrapper.append(surname)
    fullNameWrapper.append(labelName)
    fullNameWrapper.append(name)
    fullNameWrapper.append(labelLastName)
    fullNameWrapper.append(lastName)
    surname.addEventListener('input', () => {
      if (surname.classList.contains('error')) {
        surname.classList.remove('error')
      }
    })
    name.addEventListener('input', () => {
      if (name.classList.contains('error')) {
        name.classList.remove('error')
      }
    })
    let fullName = {
      fullNameWrapper,
      surname,
      name,
      lastName,
    }
    return fullName
  }
  //===================================================================================================
  // ------------  create block for contact  ------------
  function createContacts() {
    let contactsWrapper = document.createElement('div')
    contactsWrapper.classList.add('contacts__group')
    let contactSelect = document.createElement('select')
    contactSelect.classList.add('form-select')
    contactSelect.classList.add('input-small')
    let contactOptionPhone = document.createElement('option')
    contactOptionPhone.setAttribute('value', 'phone')
    contactOptionPhone.innerText = 'Телефон'
    let contactOptionEmail = document.createElement('option')
    contactOptionEmail.setAttribute('value', 'email')
    contactOptionEmail.innerText = 'Email'
    let contactOptionFacebook = document.createElement('option')
    contactOptionFacebook.setAttribute('value', 'facebook')
    contactOptionFacebook.innerText = 'Facebook'
    let contactOptionVK = document.createElement('option')
    contactOptionVK.setAttribute('value', 'vk')
    contactOptionVK.innerText = 'VK'
    let contactOptionOther = document.createElement('option')
    contactOptionOther.setAttribute('value', 'other')
    contactOptionOther.innerText = 'Другое'
    let contactInput = document.createElement('input')
    contactInput.setAttribute('type', 'text')
    contactInput.classList.add('form-control')
    contactInput.classList.add('contacts__phone')
    contactInput.setAttribute('data-inputmask', "'mask': '+9(999)-999-99-99'")
    contactInput.addEventListener('input', () => {
      if (contactInput.classList.contains('error')) {
        contactInput.classList.remove('error')
      }
    })
    let contactClose = document.createElement('button')
    contactClose.setAttribute('type', 'button')
    contactClose.classList.add('button')
    contactClose.classList.add('contacts__button')
    contactClose.classList.add('contacts__button--cancel')
    contactSelect.append(contactOptionPhone)
    contactSelect.append(contactOptionEmail)
    contactSelect.append(contactOptionFacebook)
    contactSelect.append(contactOptionVK)
    contactSelect.append(contactOptionOther)
    contactsWrapper.append(contactSelect)
    contactsWrapper.append(contactInput)
    contactsWrapper.append(contactClose)
    let contact = {
      contactsWrapper,
      contactSelect,
      contactOptionPhone,
      contactOptionEmail,
      contactOptionFacebook,
      contactOptionVK,
      contactOptionOther,
      contactInput,
      contactClose,
    }
    contactSelect.addEventListener('change', (element) => {
      console.log(contactSelect[contactSelect.selectedIndex].value)
      switch (contactSelect[contactSelect.selectedIndex].value) {
        case 'phone':
          deleteClass(contactInput)
          contactInput.classList.add('contacts__phone')
          contactInput.setAttribute(
            'data-inputmask',
            "'mask': '+9(999)-999-99-99'",
          )
          Inputmask().mask(document.querySelectorAll('.contacts__phone'))
          break
        case 'email':
          deleteClass(contactInput)
          contactInput.classList.add('contacts__email')
          break
        case 'facebook':
          deleteClass(contactInput)
          contactInput.classList.add('contacts__facebook')
          break
        case 'vk':
          deleteClass(contactInput)
          contactInput.classList.add('contacts__vk')
          break
        case 'other':
          deleteClass(contactInput)
          contactInput.classList.add('contacts__other')
          break
        default:
      }
      contactInput.classList.add()
    })
    return contact
  }
  //=================================================================================================
  //  ------------  Removing class in the element ------------
  function deleteClass(element) {
    const arrayClass = [
      'contacts__phone',
      'contacts__email',
      'contacts__facebook',
      'contacts__vk',
      'contacts__other',
    ]
    if (element.classList.contains('contacts__phone')) {
      element.removeAttribute('data-inputmask')
      Inputmask.remove(element.parentNode.querySelector('.contacts__phone'))
    }
    for (let key of arrayClass) {
      if (element.classList.contains(key)) {
        element.classList.remove(key)
      }
    }
  }
  //=================================================================================================
  // ------------  create wrapper for block contacts  ------------
  function createWrapperForAllContacts() {
    let allContacts = document.createElement('div')
    allContacts.classList.add('contacts__wrapper')
    let buttonAddContact = document.createElement('div')
    buttonAddContact.classList.add('button')
    buttonAddContact.classList.add('contacts__button-add')
    buttonAddContact.innerText = 'Добавить контакт'
    buttonAddContact.setAttribute('id', 'buttonAddContact')
    allContacts.append(buttonAddContact)
    buttonAddContact.addEventListener('click', () => {
      countContacts++
      btnAddContactVisible(countContacts)
      if (allContacts.classList.contains('contacts__padding')) {
        //
      } else {
        allContacts.classList.add('contacts__padding')
      }
      console.log(' Нажатие ADD', countContacts)
      let wrap = createContacts()
      buttonAddContact.before(wrap.contactsWrapper)
      Inputmask().mask(document.querySelectorAll('.contacts__phone'))
      // Destruction of an unnecessary field
      wrap.contactClose.addEventListener('click', () => {
        wrap.contactsWrapper.remove()
        countContacts--
        console.log(' Нажатие delete ', countContacts)
        btnAddContactVisible(countContacts)
        if (countContacts === 0) {
          if (allContacts.classList.contains('contacts__padding')) {
            allContacts.classList.remove('contacts__padding')
          }
        }
      })
    })
    let wrapper = {
      allContacts,
      countContacts,
      buttonAddContact,
    }
    return wrapper
  }
  //===================================================================================================
  // ------------   check count contact and visible button AddContact  ------------
  function btnAddContactVisible(count) {
    if (count < 10) {
      if (
        document
          .getElementById('buttonAddContact')
          .classList.contains('element__display--none')
      ) {
        document
          .getElementById('buttonAddContact')
          .classList.remove('element__display--none')
      }
    } else {
      document
        .getElementById('buttonAddContact')
        .classList.add('element__display--none')
    }
  }
  //===================================================================================================
  // ------------   function visible errors in modal window  ------------
  function printError() {
    let errors = false
    let response = serverResponse.status
    let divError = document.createElement('div')
    divError.classList.add('dialog__error')
    switch (true) {
      case response >= 200 && response <= 299:
        errors = false
        break
      case response == 422:
        for (let element of serverResponse.allData.errors) {
          let oneError422 = document.createElement('p')
          oneError422.classList.add('error__desc')
          oneError422.innerText = element.message
          divError.append(oneError422)
          if (element.field === 'name') {
            dialogModalWindow
              .querySelector('.full-name__name')
              .classList.add('error')
          }
          if (element.field === 'surname') {
            dialogModalWindow
              .querySelector('.full-name__surname')
              .classList.add('error')
          }
        }
        errors = true
        break
      case response == 404:
        let oneError400 = document.createElement('p')
        oneError400.classList.add('error__desc')
        console.log('Error: server response status = ' + serverResponse.status)
        oneError400.innerText =
          'переданный в запросе метод не существует или запрашиваемый элемент не найден в базе данных'
        divError.append(oneError400)
        errors = true
        break
      case response == 500:
        let oneError500 = document.createElement('p')
        oneError500.classList.add('error__desc')
        console.log('Error: server response status = ' + serverResponse.status)
        oneError500.innerText =
          'странно, но сервер сломался :(<br>Обратитесь к куратору Skillbox, чтобы решить проблему'
        divError.append(oneError500)
        errors = true
        break
      default:
        let oneError = document.createElement('p')
        oneError.classList.add('error__desc')
        oneError.innerText = 'Что-то пошло не так...'
        console.log('Error: server response status = ' + serverResponse.status)
        divError.append(oneError)
        errors = true
    }
    if (errors) {
      if (!dialogModalWindow.querySelector('.dialog__wrap--active')) {
        modalWindowError()
      }
      dialogModalWindow.querySelector('#buttonBig').before(divError)
    }
    return errors
  }
  //===================================================================================================
  //  ------------ Creating one entry in the table  ------------
  function createItem(oneObject) {
    let tableRow = document.createElement('div')
    tableRow.classList.add('row-data')
    tableRow.classList.add('data__client')
    let wrapUserID = document.createElement('div')
    wrapUserID.classList.add('data__col-id')
    let userID = document.createElement('p')
    userID.innerText = oneObject.id
    wrapUserID.append(userID)
    let wrapUserFullName = document.createElement('div')
    wrapUserFullName.classList.add('data__col-fullName')
    let userFullName = document.createElement('p')
    userFullName.innerText =
      oneObject.surname + ' ' + oneObject.name + ' ' + oneObject.lastName
    wrapUserFullName.append(userFullName)
    let userDateCreateWrapper = document.createElement('div')
    userDateCreateWrapper.classList.add('data__col-wrap-date')
    let userDateCreate = document.createElement('p')
    userDateCreate.classList.add('data__col-create-date')
    const dateCreate = new Date(oneObject.createdAt)
    userDateCreate.innerText =
      addNumber(dateCreate.getDate()) +
      '.' +
      addNumber(dateCreate.getMonth()) +
      '.' +
      dateCreate.getFullYear()
    let userTimeCreate = document.createElement('p')
    userTimeCreate.classList.add('data__col-create-time')
    userTimeCreate.innerText =
      addNumber(dateCreate.getHours()) +
      ':' +
      addNumber(dateCreate.getMinutes())
    let userDateUpdateWrapper = document.createElement('div')
    userDateUpdateWrapper.classList.add('data__col-wrap-update')
    let userDateUpdate = document.createElement('p')
    userDateUpdate.classList.add('data__col-update-date')
    const dateUpdate = new Date(oneObject.updatedAt)
    userDateUpdate.innerText =
      addNumber(dateUpdate.getDate()) +
      '.' +
      addNumber(dateUpdate.getMonth()) +
      '.' +
      dateUpdate.getFullYear()
    let userTimeUpdate = document.createElement('p')
    userTimeUpdate.classList.add('data__col-update-time')
    userTimeUpdate.innerText =
      addNumber(dateUpdate.getHours()) +
      ':' +
      addNumber(dateUpdate.getMinutes())
    let userContactsWrapper = document.createElement('div')
    userContactsWrapper.classList.add('data__col-contact-wrapper')
    userContactsWrapper.classList.add('contact')
    if (oneObject.contacts.length) {
      countContacts = 0
      for (let element of oneObject.contacts) {
        countContacts++
        let btnUserContact = document.createElement('a')
        btnUserContact.classList.add('btn')
        btnUserContact.classList.add('contact__user')
        btnUserContact.setAttribute('data-bs-toggle', 'tooltip')
        btnUserContact.setAttribute('data-bs-placement', 'top')
        // regular expressions for convenience visible
        let re = /(\d)(\d{3})(\d{3})(\d{2})(\d{2})/
        let reTooltip = element.value.replace(re, `+$1($2)-$3-$4-$5`)
        btnUserContact.setAttribute(
          'data-bs-title',
          element.type + ': ' + reTooltip,
        )
        switch (element.type) {
          case 'Телефон':
            btnUserContact.classList.add('contact__user-phone')
            btnUserContact.setAttribute('href', 'tel:+' + element.value)
            break
          case 'Email':
            btnUserContact.classList.add('contact__user-email')
            btnUserContact.setAttribute('href', 'mailto:' + element.value)
            break
          case 'Facebook':
            btnUserContact.classList.add('contact__user-fb')
            btnUserContact.setAttribute('href', element.value)
            break
          case 'VK':
            btnUserContact.classList.add('contact__user-vk')
            btnUserContact.setAttribute('href', element.value)
            break
          case 'Другое':
            btnUserContact.classList.add('contact__user-other')
            btnUserContact.setAttribute('href', element.value)
            break
        }
        if (countContacts > 4) {
          btnUserContact.classList.add('contact__user--visible')
        }
        userContactsWrapper.append(btnUserContact)
      }
      if (countContacts > 4) {
        let btnUserContact = document.createElement('button')
        btnUserContact.classList.add('contact__user-count')
        btnUserContact.innerHTML = '+' + (countContacts - 4)
        btnUserContact.addEventListener('click', () => {
          for (let elem of userContactsWrapper.querySelectorAll(
            '.contact__user--visible',
          )) {
            elem.classList.toggle('contact__user--visible')
          }
          btnUserContact.classList.add('contact__user--visible')
        })
        userContactsWrapper.append(btnUserContact)
      }
    }
    let userAction = document.createElement('div')
    userAction.classList.add('data__col-action')
    let btnGroup = document.createElement('div')
    btnGroup.classList.add('btn-group')
    btnGroup.classList.add('btn-event')
    btnGroup.setAttribute('role', 'group')
    btnGroup.setAttribute('aria-label', 'Group button')
    let btnEdit = document.createElement('button')
    btnEdit.innerText = 'Изменить'
    btnEdit.classList.add('btn-event__edit')
    btnEdit.classList.add('btn-event__edit-img1')
    let btnDelete = document.createElement('button')
    btnDelete.innerText = 'Удалить'
    btnDelete.classList.add('btn-event__edit')
    btnDelete.classList.add('btn-event__edit-img2')
    let btnCopy = document.createElement('button')
    btnCopy.innerText = 'Копировать'
    btnCopy.classList.add('btn-event__edit')
    btnCopy.classList.add('btn-event__edit-img3')
    btnGroup.append(btnEdit)
    btnGroup.append(btnDelete)
    btnGroup.append(btnCopy)
    btnEdit.addEventListener('click', () => {
      let block = createSpinner()
      btnEdit.innerHTML = block.blockSpinnerStatusHTML + ' Изменить'
      btnEdit.classList.remove('btn-event__edit-img1')
      modalWindowEditClient(oneObject.id, btnEdit)
    })
    btnDelete.addEventListener('click', () => {
      modalWindowDeleteClient(oneObject.id)
    })
    // copy id in clipboard
    btnCopy.addEventListener('click', () => {
      let buffer = location.href + '#id' + userID.innerText
      navigator.clipboard.writeText(buffer)
    })
    tableRow.append(wrapUserID)
    tableRow.append(wrapUserFullName)
    userDateCreateWrapper.append(userDateCreate)
    userDateCreateWrapper.append(userTimeCreate)
    userDateUpdateWrapper.append(userDateUpdate)
    userDateUpdateWrapper.append(userTimeUpdate)
    tableRow.append(userDateCreateWrapper)
    tableRow.append(userDateUpdateWrapper)
    tableRow.append(userContactsWrapper)
    userAction.append(btnGroup)
    tableRow.append(userAction)
    tableUsers.append(tableRow)
  }
  //===================================================================================================
  // ----- function open the form to add user  ------
  function modalWindowAddClient() {
    countContacts = 0
    let dialog = createDialogWindow()
    dialog.dialogTitle.innerHTML = '<strong>Новый клиент</strong>'
    let wrapperFullName = createWrapperForFullName()
    dialog.dialogBody.append(wrapperFullName.fullNameWrapper)
    dialog.dialogBody.classList.add('full-name')
    dialog.dialogBody.classList.add('contacts')
    let wrapperAllContacts = createWrapperForAllContacts()
    dialog.dialogBody.append(wrapperAllContacts.allContacts)
    dialog.btnBig.innerText = 'Сохранить'
    dialog.btnLittle.innerText = 'Отмена'
    dialog.btnBig.addEventListener('click', () => {
      if (validDataUser()) {
        saveContacts('POST')
        spinnerCondition(true)
      }
    })
    dialog.btnLittle.addEventListener('click', () => {
      // close the modal window
      closeModalWindow()
    })
    dialog.btnClose.addEventListener('click', () => {
      // close the modal window
      closeModalWindow()
    })
    // function visible modal window
    visibleModalWindow(dialog)
  }
  //===============================================================================
  //  ------------  Modal window with error ------------
  function modalWindowError() {
    let dialog = createDialogWindow()
    dialog.dialogTitle.innerHTML = '<strong>Ответ сервера</strong>'
    dialog.dialogHeaderWrap.classList.add('dialog__header-center')
    dialog.dialogHeader.classList.add('dialog__header--margin')
    let desc = document.createElement('p')
    desc.innerText = 'Ошибки:'
    desc.classList.add('dialog__desc')
    dialog.dialogBody.append(desc)
    dialog.btnBig.innerText = 'Ok'
    dialog.btnLittle.innerText = 'Отмена'
    dialog.btnBig.addEventListener('click', () => {
      // close the modal window
      closeModalWindow()
    })
    dialog.btnLittle.addEventListener('click', () => {
      // close the modal window
      closeModalWindow()
    })
    dialog.btnClose.addEventListener('click', () => {
      // close the modal window
      closeModalWindow()
    })
    // function visible modal window
    visibleModalWindow(dialog)
  }
  //===============================================================================
  // ------------  function create modal windows for client's delete  ------------
  function modalWindowDeleteClient(clientID) {
    let dialog = createDialogWindow()
    dialog.dialogTitle.innerHTML = '<strong>Удалить клиента</strong>'
    dialog.dialogHeaderWrap.classList.add('dialog__header-center')
    dialog.dialogHeader.classList.add('dialog__header--margin')
    let desc = document.createElement('p')
    desc.innerText = 'Вы действительно хотите удалить данного клиента?'
    desc.classList.add('dialog__desc')
    dialog.dialogBody.append(desc)
    dialog.btnBig.innerText = 'Удалить'
    dialog.btnLittle.innerText = 'Отмена'
    dialog.btnBig.addEventListener('click', () => {
      if (!!dialog.dialogFooter.querySelector('.error')) {
        removeChildElement(dialog.dialogFooter.querySelector('.error'))
      }
      deleteClient(clientID)
      spinnerCondition(true)
      // reset values
      countTimer = 0
      // we are waiting for a response from the server
      let timerIdDownload = setInterval(() => {
        if (serverResponse.status != null) {
          spinnerCondition(false)
          // delete the timer
          clearInterval(timerIdDownload)
          if (!printError()) {
            // close the modal window
            closeModalWindow()
            // clean table
            tableClientsCleaner()
            // create table
            setTimeout(() => {
              downloadIndex()
            }, 400)
          }
        }
        countTimer++
        console.log('delete  ЖДУ ответа сервера countTimer = ' + countTimer)
        if (countTimer > maxTimeResponseTheServer) {
          // delete the timer
          clearInterval(timerIdDownload)
          console.log('Delete timer')
          errorDisplay()
          spinnerCondition(false)
        }
      }, timeResponse)
    })
    dialog.btnLittle.addEventListener('click', () => {
      // close the modal window
      closeModalWindow()
    })
    dialog.btnClose.addEventListener('click', () => {
      // close the modal window
      closeModalWindow()
    })
    // function visible modal window
    visibleModalWindow(dialog)
  }
  //===================================================================================================
  //  ------------ function create modal window for  client's edit  ------------
  async function modalWindowEditClient(clientID, button) {
    // request the server
    requestingClientData(clientID)
    // reset values
    countTimer = 0
    countContacts = 0
    // we are waiting for a response from the server
    let timerIdDownload = setInterval(() => {
      if (serverResponse.ok) {
        // delete the timer
        clearInterval(timerIdDownload)
        if (button) {
          button.innerHTML = 'Изменить'
          button.classList.add('btn-event__edit-img1')
        } else {
          spinnerCondition(false)
        }
        let dialog = createDialogWindow()
        dialog.dialogTitle.innerHTML = '<strong>Изменить данные</strong>'
        dialog.dialogSubtitle.innerText = 'ID: ' + clientID
        let wrapperFullName = createWrapperForFullName()
        dialog.dialogBody.append(wrapperFullName.fullNameWrapper)
        dialog.dialogBody.classList.add('full-name')
        dialog.dialogBody.classList.add('contacts')
        let wrapperAllContacts = createWrapperForAllContacts()
        dialog.dialogBody.append(wrapperAllContacts.allContacts)
        dialog.btnBig.innerText = 'Сохранить'
        dialog.btnLittle.innerText = 'Отмена'
        dialog.btnBig.addEventListener('click', () => {
          if (!!dialog.dialogFooter.querySelector('.error')) {
            removeChildElement(dialog.dialogFooter.querySelector('.error'))
          }
          if (validDataUser()) {
            spinnerCondition(true)
            saveContacts('PATCH', clientID)
          }
        })
        dialog.btnLittle.addEventListener('click', () => {
          // close the modal window
          closeModalWindow()
        })
        dialog.btnClose.addEventListener('click', () => {
          // close the modal window
          closeModalWindow()
        })
        // function visible modal window
        visibleModalWindow(dialog)
        wrapperFullName.surname.value = serverResponse.allData.surname
        wrapperFullName.name.value = serverResponse.allData.name
        wrapperFullName.lastName.value = serverResponse.allData.lastName
        countContacts = wrapperAllContacts.countContacts
        if (serverResponse.allData.contacts.length) {
          if (
            wrapperAllContacts.allContacts.classList.contains(
              'contacts__padding',
            )
          ) {
            //
          } else {
            wrapperAllContacts.allContacts.classList.add('contacts__padding')
          }
          for (let element of serverResponse.allData.contacts) {
            countContacts++
            let wrap = createContacts()
            switch (element.type) {
              case 'Телефон':
                wrap.contactOptionPhone.setAttribute('selected', '')
                deleteClass(wrap.contactInput)
                wrap.contactInput.classList.add('contacts__phone')
                break
              case 'Email':
                wrap.contactOptionEmail.setAttribute('selected', '')
                deleteClass(wrap.contactInput)
                wrap.contactInput.classList.add('contacts__email')
                break
              case 'Facebook':
                wrap.contactOptionFacebook.setAttribute('selected', '')
                deleteClass(wrap.contactInput)
                wrap.contactInput.classList.add('contacts__facebook')
                break
              case 'VK':
                wrap.contactOptionVK.setAttribute('selected', '')
                deleteClass(wrap.contactInput)
                wrap.contactInput.classList.add('contacts__vk')
                break
              case 'Другое':
                wrap.contactOptionOther.setAttribute('selected', '')
                deleteClass(wrap.contactInput)
                wrap.contactInput.classList.add('contacts__other')
                break
            }
            wrap.contactInput.value = element.value
            wrapperAllContacts.buttonAddContact.before(wrap.contactsWrapper)
            // Destruction of an unnecessary field
            wrap.contactClose.addEventListener('click', () => {
              wrap.contactsWrapper.remove()
              countContacts--
              btnAddContactVisible(countContacts)
            })
          }
        } else {
        }
        dialog.dialogBody.append(wrapperAllContacts.allContacts)
        // check count contacts
        btnAddContactVisible(countContacts)
        // function visible modal window
        visibleModalWindow(dialog)
        Inputmask('+9(999)-999-99-99').mask(
          document.querySelectorAll('.contacts__phone'),
        )
      } else {
        countTimer++
        console.log('edit ЖДУ ответа сервера countTimer = ' + countTimer)
        if (countTimer > maxTimeResponseTheServer) {
          // delete the timer
          clearInterval(timerIdDownload)
          console.log('Delete timer')
          errorDisplay()
          if (button) {
            button.innerHTML = 'Изменить'
            button.classList.add('btn-event__edit-img1')
          }
        }
      }
    }, timeResponse)
  }
  //===================================================================================================
  // -------  validate information  ----------
  function validDataUser() {
    if (!!dialogModalWindow.querySelector('.dialog__error')) {
      removeChildElement(dialogModalWindow.querySelector('.dialog__error'))
    }
    let divError = document.createElement('div')
    divError.classList.add('dialog__error')
    let response = true
    arrayTextError = []
    const surname = dialogModalWindow.querySelector('.full-name__surname')
    const name = dialogModalWindow.querySelector('.full-name__name')
    if (surname.value.trim() < 2) {
      response = false
      surname.classList.add('error')
      arrayTextError.push('В поле фамилия введено менее двух символов')
    }
    if (name.value.trim() < 2) {
      response = false
      name.classList.add('error')
      arrayTextError.push('В поле имя введено менее двух символов')
    }
    if (dialogModalWindow.querySelector('.contacts__group') !== null) {
      const contactsWrapper = dialogModalWindow.querySelector(
        '.contacts__wrapper',
      )
      const contactInputAll = contactsWrapper.querySelectorAll('input')
      for (let inputOne of contactInputAll) {
        if (inputOne.classList.contains('contacts__phone')) {
          let valueContact = inputOne.value
          valueContact = Inputmask.unmask(valueContact, {
            mask: '+9(999)-999-99-99',
          })
          if (valueContact.length < 11) {
            arrayTextError.push('В поле телефон введено мало цифр')
            response = false
            inputOne.classList.add('error')
          }
        }
        if (inputOne.classList.contains('contacts__email')) {
          const email = inputOne.value
            .trim()
            .toLowerCase()
            .match(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            )
          if (!email) {
            arrayTextError.push('В поле email введено некорректное значение')
            response = false
            inputOne.classList.add('error')
          }
        }
        if (inputOne.classList.contains('contacts__vk')) {
          if (inputOne.value.trim() < 3) {
            arrayTextError.push('В поле vk введено мало символов')
            response = false
            inputOne.classList.add('error')
          }
        }
        if (inputOne.classList.contains('contacts__other')) {
          if (inputOne.value.trim() < 3) {
            arrayTextError.push('В поле Другое введено мало символов')
            response = false
            inputOne.classList.add('error')
          }
        }
        if (inputOne.classList.contains('contacts__facebook')) {
          if (inputOne.value.trim() < 3) {
            arrayTextError.push('В поле Facebook введено мало символов')
            response = false
            inputOne.classList.add('error')
          }
        }
      }
    }
    if (arrayTextError.length > 0) {
      for (let key of arrayTextError) {
        let oneError = document.createElement('p')
        oneError.classList.add('dialog__error-text')
        oneError.innerText = key
        divError.append(oneError)
      }
    }
    dialogModalWindow.querySelector('#buttonBig').before(divError)
    return response
  }
  //===================================================================================================
  // ------------  clean table clients  ------------
  function tableClientsCleaner() {
    if (tableUsers.querySelectorAll('.row-data')) {
      for (let element of tableUsers.querySelectorAll('.row-data')) {
        removeChildElement(element)
      }
    }
  }
  //===================================================================================================
  // ------------  function Destruction of an unnecessary field  ------------
  function removeChildElement(element) {
    if (!!element) {
      element.parentNode.removeChild(element)
    }
  }
  //===================================================================================================
  //  ------------   Adding a number in the date   ------------
  function addNumber(element) {
    let newNumber = element
    if (element < 10) {
      newNumber = '0' + element
    }
    return newNumber
  }
  //===================================================================================================
  // ------------   function for save contact   ------------
  function saveContacts(apiMethod, clientID = '') {
    let contacts = []
    let client = {}
    let contactsObject = dialogModalWindow.querySelectorAll('.contacts__group')
    for (let groupElement of contactsObject) {
      let typeContact = groupElement.querySelector('select').selectedOptions[0]
        .innerText
      let valueContact = groupElement.querySelector('input').value
      // unmasked value phone
      if (typeContact === 'Телефон') {
        valueContact = Inputmask.unmask(valueContact, {
          mask: '+9(999)-999-99-99',
        })
      }
      let element = {
        type: typeContact,
        value: valueContact,
      }
      contacts.push(element)
    }
    client = {
      name: document.getElementById('name').value,
      surname: document.getElementById('surname').value,
      lastName: document.getElementById('lastName').value,
      contacts,
    }
    //==========
    // Sending function for the server
    sendData(client, apiMethod, clientID)
    // reset values
    countTimer = 0
    // we are waiting for a response from the server
    let timerIdDownload = setInterval(() => {
      if (serverResponse.status != null) {
        // delete the timer
        clearInterval(timerIdDownload)
        spinnerCondition(false)
        if (!printError()) {
          closeModalWindow()
          // clean table
          tableClientsCleaner()
          // create table
          setTimeout(() => {
            downloadIndex()
          }, 400)
        }
      }
      countTimer++
      console.log('save ЖДУ ответа сервера countTimer = ' + countTimer)
      if (countTimer > maxTimeResponseTheServer) {
        // delete the timer
        clearInterval(timerIdDownload)
        console.log('Delete timer')
        errorDisplay()
        spinnerCondition(false)
      }
    }, timeResponse)
  }
  //===================================================================================================
  //  ------------   switching on or off block spinner ------------
  function spinnerCondition(condition) {
    if (condition) {
      if (!waiting.classList.contains('waiting-action')) {
        waiting.classList.add('waiting-action')
      }
    } else {
      if (waiting.classList.contains('waiting-action')) {
        waiting.classList.remove('waiting-action')
      }
    }
  }
  //===================================================================================================
  // ------------  Creating a table   ------------
  function createIndex() {
    // delete the "spinner" from window
    spinnerCondition(false)
    document.querySelector('.table-users').classList.remove('table-users__hero')
    titleUpdateDate.innerHTML =
      'Последнее изменение <span style="color: #9873FF">&#8595;</span>'
    titleCreateDate.innerHTML =
      'Дата и время создания <span style="color: #9873FF">&#8595;</span>'
    titleFullName.innerHTML =
      'Фамилия Имя Отчество <span style="color: #9873FF">&#8595; А-Я</span>'
    // sorting the elements
    titleFullName.classList.toggle('data__sort')
    titleId.innerHTML = 'ID <span style="color: #9873FF">&#8593;</span>'
    sortTableClients(serverResponse.allData, 'id', -1)
    for (let searchFinish of serverResponse.allData) {
      createItem(searchFinish)
    }
    // rendering the tooltips
    enableTolTips()
  }
  //==================================================================================================
  //  ------------  auto Complete Value ------------
  function autoCompleteValue(obj) {
    if (typeof obj !== 'object') {
      complete.push(obj)
    } else {
      for (let element in obj) {
        autoCompleteValue(obj[element])
      }
    }
  }
  //===================================================================================================
  // ------------   first load the tables into the window  ------------
  function downloadIndex() {
    // request the server
    requestingClientData()
    // reset values
    countTimer = 0
    // we are waiting for a response from the server
    let timerIdDownload = setInterval(() => {
      if (serverResponse.status != null) {
        spinnerCondition(false)
        // delete the timer
        clearInterval(timerIdDownload)
        if (!printError()) {
          // create table
          setTimeout(() => {
            // delete the timer
            clearInterval(timerIdDownload)
            // create table
            createIndex()
            // if have hash then create modal edit window
            if (location.hash !== '') {
              openWindowHash()
            }
          }, 400)
        }
      }
      countTimer++
      console.log('create index ЖДУ ответа сервера countTimer = ' + countTimer)
      if (countTimer > maxTimeResponseTheServer) {
        // delete the timer
        clearInterval(timerIdDownload)
        console.log('Delete timer')
        errorDisplay()
      }
    }, timeResponse)
  }
  //===================================================================================================
  //   ------------  function delete client   ------------
  async function deleteClient(clientID) {
    // reset values
    serverResponse = {
      ok: false,
      status: null,
      allData: null,
    }
    const response = await fetch(urlServer + '/api/clients/' + clientID, {
      method: 'DELETE',
    })
    let allData = await response.json()
    // new data
    serverResponse = {
      ok: response.ok,
      status: response.status,
      allData,
    }
    return serverResponse
  }
  //===================================================================================================
  // ------------   function for requesting customer data  ------------
  async function requestingClientData(clientID = '') {
    // reset values
    serverResponse = {
      ok: false,
      status: null,
      allData: null,
    }
    const response = await fetch(urlServer + '/api/clients/' + clientID, {
      method: 'GET',
    })
    let allData = await response.json()
    // new data
    serverResponse = {
      ok: response.ok,
      status: response.status,
      allData,
    }
    return serverResponse
  }
  //===================================================================================================
  // ------------   function for requesting customer data  ------------
  async function requestingSearchClientData(client) {
    // reset values
    serverResponse = {
      ok: false,
      status: null,
      allData: null,
    }
    const response = await fetch(urlServer + '/api/clients?search=' + client, {
      method: 'GET',
    })
    let allData = await response.json()
    // new data
    serverResponse = {
      ok: response.ok,
      status: response.status,
      allData,
    }
    return serverResponse
  }
  //===================================================================================================
  // ------------  function send data to server  ------------
  async function sendData(clientObject, apiMethod, clientID = '') {
    // reset values
    serverResponse = {
      ok: false,
      status: null,
      allData: null,
    }
    const response = await fetch(urlServer + '/api/clients' + '/' + clientID, {
      method: apiMethod,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientObject),
    })
    let allData = await response.json()
    // new data
    serverResponse = {
      ok: response.ok,
      status: response.status,
      allData,
    }
    return serverResponse
  }
  //===================================================================================================
  // ------------  Request to the database   ------------
  downloadIndex()
  //===================================================================================================
})()
