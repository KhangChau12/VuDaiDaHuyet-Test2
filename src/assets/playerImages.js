// Nhập tất cả hình ảnh nhân vật
import baKien from './player/Bá Kiến.jpg';
import lyCuong from './player/Lý Cường.jpg';
import baBa from './player/Bà Ba.jpg';
import caiLe from './player/Cai Lệ.jpg'; // Thêm import cho Cai Lệ
import ongTuDam from './player/Lão Hạc.jpg';
import thiNo from './player/Thị Nở.jpg';
import anhHangXom from './player/Ông Giáo.jpg';
import baCo from './player/Bà Cô của Thị Nở.jpg';
import binhChuc from './player/Binh Chức.jpg';
import danThuong from './player/Dân thường.jpg';
import doiTao from './player/Đội Tảo.jpg';
import chiPheo from './player/Chí Phèo.jpg';
import tuLang from './player/Tự Lãng.jpg';
import namTho from './player/Năm Thọ.jpg';

// Tạo object map từ tên vai trò đến đường dẫn hình ảnh
const playerImages = {
  'Bá Kiến': baKien,
  'Lý Cường': lyCuong,
  'Bà Ba': baBa,
  'Cai Lệ': caiLe, // Thêm mapping cho Cai Lệ
  'Lão Hạc': ongTuDam,
  'Thị Nở': thiNo,
  'Ông Giáo': anhHangXom,
  'Bà Cô của Thị Nở': baCo,
  'Binh Chức': binhChuc,
  'Dân thường': danThuong,
  'Đội Tảo': doiTao,
  'Chí Phèo': chiPheo,
  'Tự Lãng': tuLang,
  'Năm Thọ': namTho
};

// Fall back to a default image if role not found
const getPlayerImage = (role) => {
  return playerImages[role] || danThuong; // Sử dụng ảnh dân thường làm ảnh mặc định
};

export default getPlayerImage;