import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <div>
      {/* Tiêu đề trang */}
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={'LIÊN HỆ'} text2={'VỚI CHÚNG TÔI'} />
      </div>

      {/* Nội dung liên hệ */}
      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        {/* Hình ảnh liên hệ */}
        <img
          className="w-full md:max-w-[480px]"
          src={assets.contact_img}
          alt="Liên hệ chúng tôi"
        />

        {/* Thông tin liên hệ */}
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-gray-600">Cửa Hàng Của Chúng Tôi</p>
          <p className="text-gray-500">
            54709 Wilmax Station <br /> Suite 350, Washington, USA
          </p>
          <p className="text-gray-500">
            SĐT: (0)96 317 8476 <br /> Email: vuthanhtuyen911@gmail.com
          </p>
          <p className="font-semibold text-gray-500">Cơ Hội Nghề Nghiệp</p>
          <p className="text-gray-500">
            Tìm hiểu thêm về đội ngũ của chúng tôi và các vị trí tuyển dụng.
          </p>
          <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">
            Khám Phá Việc Làm
          </button>
        </div>
      </div>

      {/* Hộp đăng ký nhận tin */}
      <NewsletterBox />
    </div>
  )
}

export default Contact
