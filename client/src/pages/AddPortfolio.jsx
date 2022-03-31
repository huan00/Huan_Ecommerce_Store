import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Product from '../components/Product'

const AddPortfolio = () => {
  const { id } = useParams()
  const [products, setProducts] = useState([])
  const [userProducts, setUserProducts] = useState([])
  const [userProductList, setUserProductList] = useState([])

  useEffect(() => {
    getProducts()
    getUserProduct()
    getUserProductList()
  }, [])

  const getProducts = async () => {
    const res = await axios.get('http://localhost:3001/products')
    setProducts(res.data)
  }
  const addProduct = async (updateList) => {
    const res = await axios.put(
      `http://localhost:3001/sellers/updateproduct/${id}`,
      updateList
    )
    setUserProductList(updateList.product)

    getProducts()
    getUserProduct()
    getUserProductList()
    render()
  }
  const getUserProductList = async () => {
    const res = await axios.get(
      `http://localhost:3001/sellers/productlist/${id}`
    )
    setUserProductList(res.data)
  }

  const getUserProduct = async () => {
    const res = await axios.get(
      `http://localhost:3001/products/getProductByUser/${id}`
    )
    setUserProducts(res.data)
  }

  const handleAddProduct = (pId) => {
    const updateList = { product: [...userProductList, pId] }
    addProduct(updateList)
  }

  const handleDelete = async (productId) => {
    deleteProduct(productId)
  }

  const deleteProduct = async (productId) => {
    const index = userProductList.indexOf(productId)

    let updateList = userProductList.splice(index, 1)
    updateList = { product: [...updateList] }

    const res = await axios
      .put(`http://localhost:3001/sellers/updateproduct/${id}`, updateList)
      .then((response) => {})

    getProducts()
    getUserProduct()
    getUserProductList()
    render()
  }

  let navigate = useNavigate()
  const handleEdit = (prod) => {
    navigate(`/products/edit/${prod}`)
  }

  const render = () => {
    return (
      <div>
        <div>
          <h3>Current Portfolio</h3>
          {userProducts.map((product) => (
            <Product
              {...product}
              key={product._id}
              handleDelete={() => handleDelete(product._id)}
              handleEdit={() => handleEdit(product._id)}
            />
          ))}
        </div>
        <div>
          <h3>Avaliable Product</h3>
          {products.map((product) => (
            <Product
              {...product}
              handleAddProduct={() => handleAddProduct(product._id)}
              handleDelete={() => handleDelete(product._id)}
              editStyle={'none'}
              deleteStyle={'none'}
              key={product._id}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      AddPortfolio
      {render()}
    </div>
  )
}

export default AddPortfolio
