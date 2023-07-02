import React from 'react';
import { Delivery } from '../../src/client/pages/Delivery'

import { render } from '@testing-library/react';
import { Home } from '../../src/client/pages/Home';
import { Contacts } from '../../src/client/pages/Contacts';
import { Catalog } from '../../src/client/pages/Catalog';
import { Product } from '../../src/common/types';
import { Provider } from 'react-redux';
import { initStore } from './store';
import { CartApi, ExampleApi } from '../../src/client/api';
import { BrowserRouter } from 'react-router-dom';
import { ProductDetails } from '../../src/client/components/ProductDetails';
import { Cart } from '../../src/client/pages/Cart';

interface Page {
    Component: React.FC,
    h1: string,
    content: string
}

const api = new ExampleApi('/hw/store'),
 cart = new CartApi(),
 store = initStore(api, cart)

const pages: Page[] = [
    {
        Component: Delivery,
        h1: 'Delivery',
        content: 'Deserunt occaecati tempora. Qui occaecati est aliquam. Enim qui nulla ipsam. Incidunt impedit enim consequuntur amet at consequuntur vero. Dolor et ad facere asperiores iste est praesentium quaerat iure. Quibusdam mollitia autem quos voluptas quia est doloremque corporis et. Sed fuga quasi esse perspiciatis fugit maxime. Qui quidem amet.Dolores magnam consequatur iste aliquam qui sint non ab. Culpa saepe omnis. Recusandae vel aperiam voluptates harum. Perspiciatis qui molestiae qui tempora quisquam. Mollitia voluptatum minus laboriosam. Dolor maiores possimus repudiandae praesentium hic eos. Veritatis et repellat.Pariatur nisi nobis hic ut facilis sunt rerum id error. Soluta nihil quisquam quia rerum illo. Ipsam et suscipit est iure incidunt quasi et eum. Culpa libero dignissimos recusandae. In magni sapiente non voluptas molestias. Deserunt quos quo placeat sunt. Ea necessitatibus dolores eaque ex aperiam sunt eius. Saepe aperiam aut. Quaerat natus consequatur aut est id saepe et aut facilis.'
    },
    {
        Component: Home,
        h1: 'Welcome to Example store!',
        content: 'Culpa perspiciatis corporis facilis fugit similiqueCum aut ut eveniet rem cupiditate natus veritatis quiaQuicklyOdio aut assumenda ipsam amet reprehenderit. Perspiciatis qui molestiae qui tempora quisquamQualitativelyUt nisi distinctio est non voluptatem. Odio aut assumenda ipsam amet reprehenderitInexpensivePerspiciatis qui molestiae qui tempora quisquam. Ut nisi distinctio est non voluptatemSed voluptatum quis voluptates laudantium incidunt laudantium. Illo non quos eos vel ipsa. Explicabo itaque est optio neque rerum provident enim qui sed. Corrupti commodi voluptatem vero soluta hic.Modi corporis consectetur aliquid sit cum tenetur enim. Sed voluptatum quis voluptates laudantium incidunt laudantium. Illo non quos eos vel ipsa. Explicabo itaque est optio neque rerum provident enim qui sed. Corrupti commodi voluptatem vero soluta hic.'
    },
    {
        Component: Contacts,
        h1: 'Contacts',
        content: 'Ut non consequatur aperiam ex dolores. Voluptatum harum consequatur est totam. Aut voluptatum aliquid aut optio et ea. Quaerat et eligendi minus quasi. Culpa voluptatem voluptatem dolores molestiae aut quos iure. Repellat aperiam ut aliquam iure. Veritatis magnam quisquam et dolorum recusandae aut.Molestias inventore illum architecto placeat molestias ipsam facilis ab quo. Rem dolore cum qui est reprehenderit assumenda voluptatem nisi ipsa. Unde libero quidem. Excepturi maiores vel quia. Neque facilis nobis minus veniam id. Eum cum eveniet accusantium molestias voluptas aut totam laborum aut. Ea molestiae ullam et. Quis ea ipsa culpa eligendi ab sit ea error suscipit. Quia ea ut minus distinctio quam eveniet nihil. Aut voluptate numquam ipsa dolorem et quas nemo.'
    }
]

describe('Страницы', () => {
    it('Страницы главная, условия доставки, контакты должны иметь статическое содержимое', () => {

        const checkStaticContent = ({ Component, h1, content }: Page) => {
            const { container } = render(<Component/>)

            expect(container.textContent.split(h1).splice(1).join(h1)).toBe(content)
        }

        pages.forEach(checkStaticContent)

    });
});
describe('Каталог', () => {
    it('в каталоге должны отображаться товары, список которых приходит с сервера', () => {
        const { container } = render(<BrowserRouter basename={'/hw/store'}><Provider store={store}><Catalog/></Provider></BrowserRouter>)
        expect(container.textContent.split('Catalog').splice(1).join('Catalog')).toBe('товар 1$1DetailsItem in cartтовар 2$2DetailsItem in cartтовар 2$3Details')
    })
    const product: Product = {
        name: 'Licensed Computer',
        description: 'Carbonite web goalkeeper gloves are ergonomically designed to give easy fit',
        color: 'Sky Blue',
        price: 308,
        id: 1,
        material: 'Fresh'
    }
    const { container } = render(<Provider store={store} ><ProductDetails product={product}/></Provider>),
     HTML = container.innerHTML,
     buttonAdd: HTMLButtonElement = container.querySelector('button.ProductDetails-AddToCart')
     buttonAdd.click()
     const clickHTML = container.innerHTML

    it('на странице с подробной информацией отображаются: название товара, его описание, цена, цвет, материал и кнопка "добавить в корзину"', () => {
        expect(HTML)
        .toBe('<div class="ProductDetails row\"><div class=\"col-12 col-sm-5 col-lg-4\"><img class=\"Image\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkMAYAADkANVKH3ScAAAAASUVORK5CYII=\"></div><div class=\"col-12 col-sm-7 col-lg-6\"><h1 class=\"ProductDetails-Name\">Licensed Computer</h1><p class=\"ProductDetails-Description\">Carbonite web goalkeeper gloves are ergonomically designed to give easy fit</p><p class=\"ProductDetails-Price fs-3\">$308</p><p><button class=\"ProductDetails-AddToCart btn btn-primary btn-lg\">Add to Cart</button><span class=\"CartBadge text-success mx-3\">Item in cart</span></p><dl><dt>Color</dt><dd class=\"ProductDetails-Color text-capitalize\">Sky Blue</dd><dt>Material</dt><dd class=\"ProductDetails-Material text-capitalize\">Fresh</dd></dl></div></div>')
    })
    it('если товар уже добавлен в корзину, в каталоге и на странице товара должно отображаться сообщение об этом', () => {
        expect(clickHTML)
        .toBe('<div class=\"ProductDetails row\"><div class=\"col-12 col-sm-5 col-lg-4\"><img class=\"Image\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkMAYAADkANVKH3ScAAAAASUVORK5CYII=\"></div><div class=\"col-12 col-sm-7 col-lg-6\"><h1 class=\"ProductDetails-Name\">Licensed Computer</h1><p class=\"ProductDetails-Description\">Carbonite web goalkeeper gloves are ergonomically designed to give easy fit</p><p class=\"ProductDetails-Price fs-3\">$308</p><p><button class=\"ProductDetails-AddToCart btn btn-primary btn-lg\">Add to Cart</button><span class=\"CartBadge text-success mx-3\">Item in cart</span></p><dl><dt>Color</dt><dd class=\"ProductDetails-Color text-capitalize\">Sky Blue</dd><dt>Material</dt><dd class=\"ProductDetails-Material text-capitalize\">Fresh</dd></dl></div></div>')
    })
})
describe('Корзина', () => {
    it('в корзине должна отображаться таблица с добавленными в нее товарами и для каждого товара должны отображаться' +
     'название, цена, количество , стоимость, а также должна отображаться общая сумма заказа', () => {
        const { container } = render(<Provider store={store} ><Cart/></Provider>)
        const table = container.querySelector('table.Cart-Table.table').innerHTML

        expect(table).toBe('<thead><tr><th scope=\"col\">#</th><th scope=\"col\">Product</th><th scope=\"col\">Price</th><th scope=\"col\">Count</th><th scope=\"col\">Total</th></tr></thead><tbody><tr data-testid=\"1\"><th class=\"Cart-Index\" scope=\"row\">1</th><td class=\"Cart-Name\">string</td><td class=\"Cart-Price\">$1</td><td class=\"Cart-Count\">1</td><td class=\"Cart-Total\">$1</td></tr><tr data-testid=\"2\"><th class=\"Cart-Index\" scope=\"row\">2</th><td class=\"Cart-Name\">product 2</td><td class=\"Cart-Price\">$121</td><td class=\"Cart-Count\">5</td><td class=\"Cart-Total\">$605</td></tr></tbody><tfoot><tr><td colspan=\"4\">Order price:</td><td class=\"Cart-OrderPrice\">$606</td></tr></tfoot>')
    })
})