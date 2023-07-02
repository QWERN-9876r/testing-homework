const { assert } = require('chai'),
 { START_URL, END_URL } = require('../data')

async function getPage(browser) {
    const puppeteer = await browser.getPuppeteer()
    const [page] = await puppeteer.pages()

    return page
}

function createUrl(path) {
    return START_URL + path + END_URL
}
async function click(selector, browserOrPage) {
    await (await browserOrPage.$(selector)).click()
}
async function writeInInput(text, selector, page) {
    await click(selector, page)
    await page.keyboard.type(text)
}
const pages = [
    {
        urlSelector: 'nav a[href="/hw/store/catalog"]',
        name: 'каталога'
    },
    {
        urlSelector: 'nav a[href="/hw/store/delivery"]',
        name: 'условий доставки',
        html: 'Example storeCatalogDeliveryContactsCart (3)Welcome to Example store!Culpa perspiciatis corporis facilis fugit similiqueCum aut ut eveniet rem cupiditate natus veritatis quiaQuicklyOdio aut assumenda ipsam amet reprehenderit. Perspiciatis qui molestiae qui tempora quisquamQualitativelyUt nisi distinctio est non voluptatem. Odio aut assumenda ipsam amet reprehenderitInexpensivePerspiciatis qui molestiae qui tempora quisquam. Ut nisi distinctio est non voluptatemSed voluptatum quis voluptates laudantium incidunt laudantium. Illo non quos eos vel ipsa. Explicabo itaque est optio neque rerum provident enim qui sed. Corrupti commodi voluptatem vero soluta hic.Modi corporis consectetur aliquid sit cum tenetur enim. Sed voluptatum quis voluptates laudantium incidunt laudantium. Illo non quos eos vel ipsa. Explicabo itaque est optio neque rerum provident enim qui sed. Corrupti commodi voluptatem vero soluta hic.'
    },
    {
        urlSelector: 'nav a[href="/hw/store/"]',
        name: 'главная',
        html: 'Example storeCatalogDeliveryContactsCart (3)DeliveryDeserunt occaecati tempora. Qui occaecati est aliquam. Enim qui nulla ipsam. Incidunt impedit enim consequuntur amet at consequuntur vero. Dolor et ad facere asperiores iste est praesentium quaerat iure. Quibusdam mollitia autem quos voluptas quia est doloremque corporis et. Sed fuga quasi esse perspiciatis fugit maxime. Qui quidem amet.Dolores magnam consequatur iste aliquam qui sint non ab. Culpa saepe omnis. Recusandae vel aperiam voluptates harum. Perspiciatis qui molestiae qui tempora quisquam. Mollitia voluptatum minus laboriosam. Dolor maiores possimus repudiandae praesentium hic eos. Veritatis et repellat.Pariatur nisi nobis hic ut facilis sunt rerum id error. Soluta nihil quisquam quia rerum illo. Ipsam et suscipit est iure incidunt quasi et eum. Culpa libero dignissimos recusandae. In magni sapiente non voluptas molestias. Deserunt quos quo placeat sunt. Ea necessitatibus dolores eaque ex aperiam sunt eius. Saepe aperiam aut. Quaerat natus consequatur aut est id saepe et aut facilis.'
    },
    {
        urlSelector: 'nav a[href="/hw/store/contacts"]',
        name: 'контактов',
        html: 'Example storeCatalogDeliveryContactsCart (3)ContactsUt non consequatur aperiam ex dolores. Voluptatum harum consequatur est totam. Aut voluptatum aliquid aut optio et ea. Quaerat et eligendi minus quasi. Culpa voluptatem voluptatem dolores molestiae aut quos iure. Repellat aperiam ut aliquam iure. Veritatis magnam quisquam et dolorum recusandae aut.Molestias inventore illum architecto placeat molestias ipsam facilis ab quo. Rem dolore cum qui est reprehenderit assumenda voluptatem nisi ipsa. Unde libero quidem. Excepturi maiores vel quia. Neque facilis nobis minus veniam id. Eum cum eveniet accusantium molestias voluptas aut totam laborum aut. Ea molestiae ullam et. Quis ea ipsa culpa eligendi ab sit ea error suscipit. Quia ea ut minus distinctio quam eveniet nihil. Aut voluptate numquam ipsa dolorem et quas nemo.'
    }
]

describe('Общие требования', async function() {
    it('Шапка сайта', async function({browser}) {
        await browser.url(createUrl(''));
        const page = await getPage(browser)

        await browser.setWindowSize(500, 1080)
        await browser.pause(20)
        const logo = await page.$('a[href="/hw/store/"]'),
         navLinks = await page.$('a[href="/hw/store/cart"]'),
         navbar = await page.$('div.Application-Menu.navbar-collapse.collapse')

        await click('nav button', browser)
        // const button = await this.browser.$('nav button')
        // await button.assertView('plain')
        // await this.browser.assertView('top', '.Application-Menu.navbar-collapse')

        await assert.ok( logo, 'Шапка не появилась или не является ссылкой' )
        await assert.ok( navLinks, 'Не появилась ссылка на корзину' )
        await assert.ok( navbar, 'Меню ссылок не появилось' )

    })
    // it('Изменение размера экрана', async function({browser}) {
        // await browser.pause(3000)
        // const page = await getPage(browser)
        // const navButton = await page.$('button.Application-Toggler.navbar-toggler')
        // await browser.url(createUrl(''))
        // await browser.setWindowSize(1920, 1080)
        // await browser.assertView('top', 'nav')

        // await assert.ok( navButton, 'Гамбургер не появился' )
    // })
});

describe('Страницы', async function() {
    it('Доступность всех страниц', async function({browser}) {
        const page = await getPage(browser)

        const checkPage = async (urlSelector, name) => {
            await (await browser.$(urlSelector)).click()
            await browser.pause(70)
            await browser.url(createUrl(urlSelector.split('"/hw/store/')[1].split('"')[0]))
            await browser.pause(50)
            const selector = await page.$('div#root')
            await assert.ok( selector, `Страница ${name} отсутствует` )
        }

        for ( {urlSelector, name} of pages ) {
            await checkPage(urlSelector, name)
            await browser.pause(100)
        }
    })
})

describe('Каталог', async function() {
    it('для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре', async function({browser}) {
        await browser.url(createUrl('catalog'))
        const page = await getPage(browser)

        await browser.pause(25)
        await (await page.$('a.ProductItem-DetailsLink.card-link')).click()

        await expect(browser).toHaveUrl(createUrl('catalog' + '/0').replace(END_URL, ''))
    })
    it('если товар уже добавлен в корзину, повторное нажатие кнопки "добавить в корзину" должно увеличивать его количество', async function({browser}) {
        await browser.url(createUrl('catalog'))
        const page = await getPage(browser)

        await browser.pause(25)
        await browser.url(createUrl('catalog/0'))
        await browser.pause(25)

        const buttonAddToCart = await page.$('button.ProductDetails-AddToCart')
        await buttonAddToCart.click()
        await buttonAddToCart.click()
        await buttonAddToCart.click()

        await (await page.$('a[href="/hw/store/cart"]')).click()
        await browser.pause(50)
        const count = await browser.$('td.Cart-Count')
        await expect(count).toHaveText('3')
    })
    it('содержимое корзины должно сохраняться между перезагрузками страницы', async function({browser}) {
        await browser.url(createUrl('catalog'))
        const page = await getPage(browser)

        await browser.pause(25)
        // await (await page.$('a.ProductItem-DetailsLink')).click()
        await browser.url(createUrl('catalog/0'))
        await browser.pause(25)

        const buttonAddToCart = await page.$('button.ProductDetails-AddToCart')
        await buttonAddToCart.click()

        await browser.url(createUrl('cart'))
        await browser.pause(50)

        const notEmpty = await page.$('button.Cart-Clear')

        await assert.ok(notEmpty, 'после перезагрузки корзина опустошается')
    })
})
describe('Корзина', async function() {
    it('в шапке рядом со ссылкой на корзину должно отображаться количество не повторяющихся товаров в ней', async function({browser}) {
        await browser.url(createUrl(''))

        const cartLink = await browser.$('a[href="/hw/store/cart"]')
        await expect(cartLink).toHaveText('Cart (1)')
    })
    it('в корзине должна быть кнопка "очистить корзину", по нажатию на которую все товары должны удаляться', async function({browser}) {
        await browser.url(createUrl('catalog'))
        const page = await getPage(browser)
        await browser.pause(25)

        await browser.url(createUrl('catalog/0'))
        await browser.pause(25)
        const buttonAddToCart = await page.$('button.ProductDetails-AddToCart')
        await buttonAddToCart.click()

        await (await page.$('a[href="/hw/store/cart"]')).click()
        await browser.pause(25)
        const buttonClear = await page.$('button.Cart-Clear')
        await assert.ok(buttonClear, 'кнопка отчистки корзины отсутствует')
        await buttonClear.click()
        await browser.pause(50)
        const empty = await browser.$('div.col')

        await expect(empty).toHaveText('Shopping cart\nCart is empty. Please select products in the catalog.')
        const link = await page.$('div.col a')
        await assert.ok(link, 'если корзина пустая, должна отображаться ссылка на каталог товаров')
    } )
    it('Форма', async function({browser}) {
        const page = await getPage(browser)

        await browser.url(createUrl('catalog/0'))
        await browser.pause(25)
        const buttonAddToCart = await page.$('button.ProductDetails-AddToCart')
        await buttonAddToCart.click()

        await (await page.$('a[href="/hw/store/cart"]')).click()
        await browser.pause(25)

        await writeInInput('+79684994153', '#f-phone', page)
        await click('button.Form-Submit.btn.btn-primary', page)

        await assert.ok( await page.$('.Form-Field.Form-Field_type_phone.form-control:not(.is-invalid)'), 'Поле ввода телефона должно принимать правильные номера')
        await writeInInput('Name', '#f-name', page)
        await writeInInput('Loooong address...', '#f-address', page)
        await browser.pause(30)
        await click('button.Form-Submit.btn.btn-primary', page)
        await browser.pause(100)
        await assert.ok( await page.$('div.Cart-SuccessMessage'), 'После отправке формы должно появлятся окно говорящее об этом.')
    })
})