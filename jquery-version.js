$(function() {
    const urlApi = 'http://www.tender.pro/api/_info.companylist_by_set.json'
    const $table = $('.table')
    const $pagin = $('.pagination-list')
    const params = {
        _key: '6dea68e23416b21d201571d4c9263a57',
        set_type_id: 7,
        set_id: 2
    }
    let activeNumPage = 1
    const currentClass = 'is-current'

    generatePages()
    getContent({max_rows: 5})

    function generatePages() {
        requestApi({})
          .then(res => {
              const rows = 5
              const maxPage = res.result.args.max_rows / rows
              let item = ''
              for(let i = 1; i <= maxPage; i++) {
                  // is-current класс для активности
                  item += `<li data-page="${i}">
                              <a class="pagination-link ${i == activeNumPage ? currentClass : ''}" >${i}</a>
                            </li>`
              }
              $pagin.append(item)

              $pagin.find('li').on('click', function() {
                  const $that = $(this)
                  let page = parseInt($that.data('page'))
                  if ($that.find('a').hasClass(currentClass)) {
                      return false
                  }
                  activeNumPage = page

                  getContent({offset: --page, max_rows: 5})
                  markActiveItemMenu(activeNumPage)
              })
        })
    }
    function getContent(param) {
        requestApi(param)
          .then(response => {
              $table.find('tbody tr').remove()
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
              $table.find('tbody').append(row)
          })
    }

    function requestApi(param) {
        return new Promise((resolve, reject) => {
            $.get(urlApi, {...params, ...param}, (response) => {
                console.log("data", JSON.parse(response));
                response = JSON.parse(response)
                if (response.success && response.result.data.length > 0) {
                    resolve(response)
                }
            })
        })
    }

    function markActiveItemMenu(actPage) {
        $pagin.find('li').each((_, item) => {
            const $item = $(item)
            if ($item.data('page') == actPage) {
                $item.find('a').addClass(currentClass)
            } else {
                $item.find('a').removeClass(currentClass)
            }
        })
    }

})
