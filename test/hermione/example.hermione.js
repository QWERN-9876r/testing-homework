const { assert } = require('chai');

async function getPage(browser) {
    const puppeteer = await browser.getPuppeteer()
    const [page] = await puppeteer.pages()

    return page
}
const pages = [
    {
        url: 'catalog',
        name: 'каталога'
    },
    {
        url: 'delivery',
        name: 'условий доставки',
        html: 'Example storeCatalogDeliveryContactsCart (3)Welcome to Example store!Culpa perspiciatis corporis facilis fugit similiqueCum aut ut eveniet rem cupiditate natus veritatis quiaQuicklyOdio aut assumenda ipsam amet reprehenderit. Perspiciatis qui molestiae qui tempora quisquamQualitativelyUt nisi distinctio est non voluptatem. Odio aut assumenda ipsam amet reprehenderitInexpensivePerspiciatis qui molestiae qui tempora quisquam. Ut nisi distinctio est non voluptatemSed voluptatum quis voluptates laudantium incidunt laudantium. Illo non quos eos vel ipsa. Explicabo itaque est optio neque rerum provident enim qui sed. Corrupti commodi voluptatem vero soluta hic.Modi corporis consectetur aliquid sit cum tenetur enim. Sed voluptatum quis voluptates laudantium incidunt laudantium. Illo non quos eos vel ipsa. Explicabo itaque est optio neque rerum provident enim qui sed. Corrupti commodi voluptatem vero soluta hic.'
    },
    {
        url: '',
        name: 'главная',
        html: 'Example storeCatalogDeliveryContactsCart (3)DeliveryDeserunt occaecati tempora. Qui occaecati est aliquam. Enim qui nulla ipsam. Incidunt impedit enim consequuntur amet at consequuntur vero. Dolor et ad facere asperiores iste est praesentium quaerat iure. Quibusdam mollitia autem quos voluptas quia est doloremque corporis et. Sed fuga quasi esse perspiciatis fugit maxime. Qui quidem amet.Dolores magnam consequatur iste aliquam qui sint non ab. Culpa saepe omnis. Recusandae vel aperiam voluptates harum. Perspiciatis qui molestiae qui tempora quisquam. Mollitia voluptatum minus laboriosam. Dolor maiores possimus repudiandae praesentium hic eos. Veritatis et repellat.Pariatur nisi nobis hic ut facilis sunt rerum id error. Soluta nihil quisquam quia rerum illo. Ipsam et suscipit est iure incidunt quasi et eum. Culpa libero dignissimos recusandae. In magni sapiente non voluptas molestias. Deserunt quos quo placeat sunt. Ea necessitatibus dolores eaque ex aperiam sunt eius. Saepe aperiam aut. Quaerat natus consequatur aut est id saepe et aut facilis.'
    },
    {
        url: 'contacts',
        name: 'контактов',
        html: 'Example storeCatalogDeliveryContactsCart (3)ContactsUt non consequatur aperiam ex dolores. Voluptatum harum consequatur est totam. Aut voluptatum aliquid aut optio et ea. Quaerat et eligendi minus quasi. Culpa voluptatem voluptatem dolores molestiae aut quos iure. Repellat aperiam ut aliquam iure. Veritatis magnam quisquam et dolorum recusandae aut.Molestias inventore illum architecto placeat molestias ipsam facilis ab quo. Rem dolore cum qui est reprehenderit assumenda voluptatem nisi ipsa. Unde libero quidem. Excepturi maiores vel quia. Neque facilis nobis minus veniam id. Eum cum eveniet accusantium molestias voluptas aut totam laborum aut. Ea molestiae ullam et. Quis ea ipsa culpa eligendi ab sit ea error suscipit. Quia ea ut minus distinctio quam eveniet nihil. Aut voluptate numquam ipsa dolorem et quas nemo.'
    }
]

describe('Общие требования', async function() {
    it('Шапка сайта', async function({browser}) {
        await browser.url('http://localhost:3000/hw/store');

        const page = await getPage(browser)

        await browser.pause(200)

        const logo = await page.$('a[href="/hw/store/"]'),
         navLinks = await page.$('a[href="/hw/store/cart"]')

        await assert.ok( logo, 'Шапка не появилась или не является ссылкой' )
        await assert.ok( navLinks, 'Не появилась ссылка на карзину' )

    })
    it('Изменение размера экрана', async function({browser}) {
        const page = await getPage(browser)
        const navButton = await page.$('button.Application-Toggler.navbar-toggler')
        await browser.url('http://localhost:3000/hw/store')
        await browser.setWindowSize(1920, 500)
        await browser.pause(50)
        await browser.assertView('top', 'nav')

        await assert.ok( navButton, 'Гамбургер не появился' )
    })
});

describe('Страницы', async function() {
    it('Доступность всех страниц', async function({browser}) {
        const page = await getPage(browser)

        const checkPage = async (url, name) => {
            await browser.url('http://localhost:3000/hw/store/' + url)
            const selector = await page.$('div#root')
            await assert.ok( selector, `Страница ${name} отсутствует` )
        }

        for ( {url, name} of pages ) {
            await checkPage(url, name)
            await browser.pause(100)
        }
    })
    it('страницы главная, условия доставки, контакты должны иметь статическое содержимое', async function({browser}) {
        const page = await getPage(browser),
         staticPages = pages.slice(1, pages.length)

        const checkStatic = async (url, name, html) => {
            await browser.url('http://localhost:3000/hw/store/' + url)
            // await browser.setWindowSize(1920, 1080)
            // // const body = await page.$('body')
            // await browser.pause(100)
            // await browser.assertView(name, 'div.container', {
            //     portoverflow: true
            // })
        }
        await checkStatic(staticPages[0].url, staticPages[0].name, staticPages[0].html)
        await browser.pause(200)

        // for ( { url, name, html } of staticPages ) {

        // }
    } )
})