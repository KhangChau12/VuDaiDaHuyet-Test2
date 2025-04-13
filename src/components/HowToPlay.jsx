import { useEffect, useState } from 'react'
import "../styles/home.css"

import background from "../assets/image.png";
import title from "../assets/horititle.png";

function Instruction({ back }) {
    useEffect(() => {
        const contents = document.querySelector('.content');

        contents.addEventListener('scroll', () => {
            contents.classList.add('scrolling');
        })

        contents.addEventListener('mouseleave', () => {
            contents.classList.remove('scrolling');
        })
    }, []);

    return (<div className='instruction'>
        <div className='background'>
            <img src={background}></img>
        </div>
        <div id='title'>
            <img src={title}></img>
        </div>
        <h1>Hướng dẫn sử dụng</h1>
        <div id='container'>
            <div class="content">
                <h2>Mục đích</h2>
                <p>Ứng dụng này giúp Hướng Sư (quản trò) điều hành board game "Vũ Đại Dạ Huyết" để dễ dàng hơn.</p>

                <h2>Cách sử dụng</h2>
                <ul>
                    <li>Bắt đầu ván chơi mới và nhập tên người chơi cho mỗi vai trò.</li>
                    <li>Sử dụng chế độ đêm để gọi từng nhân vật và ghi lại các hành động.</li>
                    <li>Ban ngày, theo dõi các sự kiện, quản lý mua/sử dụng thẻ và bồ phiếu.</li>
                    <li>Kích hoạt các sự kiện đặc biệt khi cần.</li>
                    <li>Theo dõi trạng thái người chơi trong danh sách chi tiết.</li>
                </ul>

                <h2>Lưu ý</h2>
                <p>Ứng dụng chỉ lưu trữ dữ liệu trong trình duyệt của bạn. Không đóng tab hoặc xóa dữ liệu trình duyệt nếu muốn giữ tiến trình.</p>

                <a onClick={back} class="button">Quay lại màn hình chính</a>
            </div>
        </div>
    </div>);
}

export default Instruction;