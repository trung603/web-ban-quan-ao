import axios from 'axios'
import React, { useState } from 'react'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Login = ({setToken}) => {

  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const onSubmitHandler = async(e) =>{
    try {
      e.preventDefault();
      const response = await axios.post(backendUrl + '/api/user/admin',{email,password})
      console.log(response);
      if (response.data.success) {
        localStorage.setItem("token", response.data.token); 
        setToken(response.data.token)
        toast.success('Đăng nhập thành công!');
      }else{
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-gray-100">
  <div className="bg-white shadow-lg rounded-xl px-10 py-8 max-w-md w-full">
    <h1 className="text-3xl font-semibold text-gray-800 text-center mb-6">
      Admin Panel
    </h1>
    <form onSubmit={onSubmitHandler} className="space-y-5">
      {/* Email Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
          type="email"
          placeholder="your@email.com"
          required
        />
      </div>

      {/* Password Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
          type="password"
          placeholder="Enter your password"
          required
        />
      </div>

      {/* Login Button */}
      <button
        type="submit"
        className="w-full py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition font-medium text-lg shadow-md"
      >
        Đăng nhập
      </button>
    </form>
  </div>
</div>

  )
}

export default Login
