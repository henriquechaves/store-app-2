import axios from 'axios'
import cuid from 'cuid'

const url = 'http://henriquechaves2.getsandbox.com'

function api(endpoint, method = 'get', body = {}) {
  let config = {
    method: method,
    url: `${url}/${endpoint}`,
    responseType: 'json',
    headers: { 'content-type': 'application/json' },
  }
  // console.log(config);
  if (( method === 'PUT') || ( method === 'POST')) config.data = body

  return axios(config).then(res => res.data).catch(err => { console.log('Erro ao lancar axios. config: ', config, " Res: =========> ", err) })

}

export const getOne = (endpoint, id) => api(`${endpoint}/${id}`).then(res => res)

export const getAll = endpoint => api(`${endpoint}s`).then(res => {
  const withId = res.filter(elem => 'id' in elem)
  const withCuid = withId.map(elem => 'cuid' in elem ? elem : Object.assign({}, elem, { cuid: cuid() }))
  const r = (endpoint === 'user') ? withCuid :
    withCuid.map(elem => {
      elem.price.value = parseInt(elem.price.value, 10)
      elem.totalAffiliates = elem.affiliates.length
      return elem
    })
  // console.log(r)
  return r
})

export const addOne = (endpoint, element) => api(endpoint, 'POST', element).then(res => res)

export const updateOne = (endpoint, element) => api(`${endpoint}/${element.id}`, 'PUT', element).then(res => res)

export const deleteOne = (endpoint, id) => api(`${endpoint}/${id}`, 'DELETE').then(res => res)


//=======================================================
// funções fake:
//=======================================================

// export const getOne = (e, i) => e === 'product' ? Promise.resolve(prods[i]) : Promise.resolve(users[i])
//
// export const getAll = (e) => e === 'product' ? Promise.resolve(prods) : Promise.resolve(users)
//
// export const addOne = () => Promise.resolve({ status: 'ok' })
//
// export const updateOne = (e, i) => Promise.resolve({ result: prods[i] })
//
// export const deleteOne = () => Promise.resolve({ status: 'ok' })

const prods = [ { owner: 1,
    thumb: 'https://hotmart.s3.amazonaws.com/product_pictures/cf8aaddf-858d-428e-ac92-02833c535784/CoverMeuEvento.png',
    price: { currency: 'USD', value: 290 },
    description: 'Aqui vai a descrição do meu evento à venda na plataforma da Hotmart! Listarei detalhes e todas as informações que o consumidor precisa saber sobre ele. Tudo para facilitar o processo de compra e convencimento.',
    affiliates: [ 2 ],
    title: 'Meu Evento',
    id: 1,
    cuid: 'cj3s0ceyv0000l5wdx7f0k99g',
    totalAffiliates: 1 },
  { owner: 1,
    thumb: 'https://hotmart.s3.amazonaws.com/product_pictures/cf8aaddf-858d-428e-ac92-02833c535784/CoverMeuEvento.png',
    price: { currency: 'BRL', value: 180 },
    description: 'Este é o Meu Curso Online, versão 1.0. Nesse curso você vai aprender diversas técnicas e ferramentas para melhorar seu desempenho. Com o Meu Curso Online você consegue aumentar sua performance diária e poderá desenvolver nova habilidade em um piscar de olhos!',
    affiliates: [ 2 ],
    title: 'Meu Curso Online',
    id: 2,
    cuid: 'cj3s0ceyv0001l5wdmzcggnny',
    totalAffiliates: 1 },
  { owner: 1,
    thumb: 'https://blog.hotmart.com/wp-content/uploads/2016/07/blog_hotmart_02.png',
    price: { currency: 'USD', value: 350 },
    description: 'Descrição do meu produto incrivel.',
    affiliates: [ 2 ],
    title: 'Produto Incrivel',
    id: 5,
    cuid: 'cj3s0ceyv0002l5wd3n4vzy6k',
    totalAffiliates: 1 },
  { owner: 1,
    thumb: 'https://blog.hotmart.com/wp-content/uploads/2016/04/hotmart_club-1.png',
    price: { currency: 'BRL', value: 450 },
    description: 'Esta é a descrição do meu curso fabuloso.',
    affiliates: [],
    title: 'Curso Fabuloso',
    id: 6,
    cuid: 'cj3s0ceyv0003l5wda4o3d18h',
    totalAffiliates: 0 },
  { owner: 1,
    thumb: 'https://i.ytimg.com/vi/J48QPnsl5Jg/maxresdefault.jpg',
    price: { currency: 'USD', value: 200 },
    description: 'Informações a respeito do meu outro produto incrivel.',
    affiliates: [],
    title: 'Outro Produto Incrivel',
    id: 7,
    cuid: 'cj3s0ceyv0004l5wdar5y3od7',
    totalAffiliates: 0 },
  { owner: 1,
    thumb: 'https://i.ytimg.com/vi/J48QPnsl5Jg/maxresdefault.jpg',
    price: { currency: 'BRL', value: 800 },
    description: 'Este é um curso diverso.',
    affiliates: [],
    title: 'Curso Diverso',
    id: 8,
    cuid: 'cj3s0ceyw0005l5wdysq402db',
    totalAffiliates: 0 },
  { owner: 1,
    thumb: 'https://blog.hotmart.com/wp-content/uploads/2016/04/hotmart_club-1.png',
    price: { currency: 'BRL', value: 250 },
    description: 'Descrevendo esse produto para teste.',
    affiliates: [],
    title: 'Produto Incrivel',
    id: 9,
    cuid: 'cj3s0ceyw0006l5wd4o9u94ky',
    totalAffiliates: 0 },
  { owner: 1,
    thumb: 'https://blog.hotmart.com/wp-content/uploads/2016/07/blog_hotmart_02.png',
    price: { currency: 'USD', value: 255 },
    description: 'Descrevendo ... ',
    affiliates: [],
    title: 'Meu Curso Online',
    id: 10,
    cuid: 'cj3s0ceyw0007l5wdq1rov6bd',
    totalAffiliates: 0 },
  { owner: 1,
    thumb: 'https://blog.hotmart.com/wp-content/uploads/2016/06/img_blog_960x600_ok.png',
    price: { currency: 'BRL', value: 155 },
    description: 'Descrevendo outro produto.',
    affiliates: [],
    title: 'Produto Incrivel',
    id: 11,
    cuid: 'cj3s0ceyw0008l5wdzznzndas',
    totalAffiliates: 0 },
  { owner: 1,
    thumb: 'https://hotmart.s3.amazonaws.com/product_pictures/cf8aaddf-858d-428e-ac92-02833c535784/CoverMeuEvento.png',
    price: { currency: 'BRL', value: 255 },
    description: 'Descrevendo.',
    affiliates: [],
    title: 'Produto Teste',
    id: 12,
    cuid: 'cj3s0ceyw0009l5wdtemp1v1n',
    totalAffiliates: 0 },
  { owner: 1,
    thumb: 'https://hotmart.s3.amazonaws.com/product_pictures/cf8aaddf-858d-428e-ac92-02833c535784/CoverMeuEvento.png',
    price: { currency: 'BRL', value: 255 },
    description: 'Descrevendo um produto teste.',
    affiliates: [],
    title: 'Meu Curso Online',
    id: 13,
    cuid: 'cj3s0ceyw000al5wdnq24n91l',
    totalAffiliates: 0 },
  { owner: 1,
    thumb: 'https://blog.hotmart.com/wp-content/uploads/2016/06/img_blog_960x600_ok.png',
    price: { currency: 'BRL', value: 155 },
    description: 'Descrvendo esse produto.',
    affiliates: [],
    title: 'Meu Curso Online',
    id: 14,
    cuid: 'cj3s0ceyw000bl5wd8q8ia7ym',
    totalAffiliates: 0 },
  { owner: 1,
    thumb: 'https://blog.hotmart.com/wp-content/uploads/2016/07/blog_hotmart_02.png',
    price: { currency: 'BRL', value: 255 },
    description: 'Lorem ipsum.',
    affiliates: [],
    title: 'Produto Incrivel',
    id: 15,
    cuid: 'cj3s0ceyw000cl5wdqix4kche',
    totalAffiliates: 0 },
  { owner: 1,
    thumb: 'https://blog.hotmart.com/wp-content/uploads/2016/04/hotmart_club-1.png',
    price: { currency: 'USD', value: 160 },
    description: 'Descrevendo.',
    affiliates: [],
    title: 'Meu Evento',
    id: 16,
    cuid: 'cj3s0ceyw000dl5wdf6kodpv6',
    totalAffiliates: 0 } ]
