;(function() {
    function TenderApiTable(rows, pagin, table) {
        this.urlApi = 'http://www.tender.pro/api/_info.companylist_by_set.json?_key=6dea68e23416b21d201571d4c9263a57&set_type_id=7&set_id=2'
        this.rows = rows
        this.pagin = document.querySelector(pagin)
        this.table = document.querySelector(table)
        this.activeNumPage = 1
        this.currentClass = 'is-current'

    }
    TenderApiTable.prototype.init = function () {
        this.getContent({max_rows: 5})
        this.generatePages({})
    }
    TenderApiTable.prototype.requestServer = async function (params) {
        const url = new URL(this.urlApi)
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        let response = await fetch(url)
        response = await response.json()
        if (response.success) {
            return response
        }
    }
    TenderApiTable.prototype.getContent = async function (params) {
        const response = await this.requestServer(params)
        if (this.table.querySelector('tbody tr') && this.table.querySelector('tbody tr').length) {
            this.table.querySelector('tbody tr').remove()
        }
        let row = ''
        response.result.data.forEach(item => {
            row += `<tr>
              <td>${item.address_legal}</td>
              <td>${item.title_full}</td>
              <td>${item.anno_short}</td>
              <td>${item.rating}</td>
              <td>${item.is_seller_producer}</td>
              <td>${item.country_id}</td>
              <td>${item.fax}</td>
              <td>${item.is_type_seller}</td>
              <td>${item.address}</td>
              <td>${item.id}</td>
              <td>${item.anno}</td>
              <td>${item.type_name}</td>
              <td>${item.country_name}</td>
              <td>${item.phone}</td>
              <td>${item.seller_type_name}</td>
              <td>${item.kpp}</td>
              <td>${item.ogrn}</td>
              <td>${item.inn}</td>
              <td>${item.site}</td>
              <td>${item.title}</td>
            </tr>`
        })
        this.table.querySelector('tbody').innerHTML = row
    }
    TenderApiTable.prototype.generatePages = async function (params) {
        const response = await this.requestServer(params)
        const maxPage = response.result.args.max_rows / this.rows
        let item = ''
        for (let i = 1; i <= maxPage; i++) {
            // is-current класс для активности
            item += `<li data-page="${i}">
                          <a class="pagination-link ${i == this.activeNumPage ? this.currentClass : ''}" >${i}</a>
                        </li>`
        }
        this.pagin.innerHTML = item

        this.pagin.addEventListener('click', (e) => {
            let page = parseInt(e.target.closest('li').dataset.page)
            if (e.target.classList.contains(this.currentClass)) {
                return false
            }
            this.activeNumPage = page

            this.getContent({offset: --page, max_rows: 5})
            this.markActiveItemMenu(this.activeNumPage)
        })
    }
    TenderApiTable.prototype.markActiveItemMenu = function (actPage) {
        const pageItems = this.pagin.querySelectorAll('li')
        for(let i = 0; i < pageItems.length; i++) {
            if (pageItems[i].dataset.page == actPage) {
                pageItems[i].querySelector('a').classList.add(this.currentClass)
            } else {
                pageItems[i].querySelector('a').classList.remove(this.currentClass)
            }
        }
    }
    const tender = new TenderApiTable(5, '.pagination-list', '.table')
    tender.init()
})()