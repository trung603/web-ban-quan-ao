import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <div>
      {/* Tiêu đề trang */}
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      {/* Nội dung liên hệ */}
      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        {/* Hình ảnh liên hệ */}
        <img
          className="w-full md:max-w-[480px]"
          src={assets.contact_img}
          alt="Contact us"
        />

        {/* Thông tin liên hệ */}
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-gray-600">Our Store</p>
          <p className="text-gray-500">
            54709 Wilmax Station <br /> Suite 350, Washington, USA
          </p>
          <p className="text-gray-500">
            Tel: (0)96 317 8476 <br /> Email: vuthanhtuyen911@gmail.com
          </p>
          <p className="font-semibold text-gray-500">Careers at Our Store</p>
          <p className="text-gray-500">
            Learn more about our teams and job openings.
          </p>
          <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">
            Explore Jobs
          </button>
        </div>
      </div>

      {/* Hộp đăng ký nhận tin */}
      <NewsletterBox />
    </div>
  )
}

export default Contact
