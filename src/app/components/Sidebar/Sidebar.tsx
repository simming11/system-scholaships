import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="w-1/4 bg-white p-6 shadow-lg rounded-lg mb-8">
      <h2 className="text-2xl font-bold mb-6">ประเภท</h2>
      <ul className="space-y-4">
        <li>
          <Link href="/path/to/page" className="text-blue-600 hover:underline hover:text-blue-800">
            แนะนำทุนรัฐบาลและทุนอื่น
          </Link>
        </li>
        <li>
          <Link href="/path/to/page" className="text-blue-600 hover:underline hover:text-blue-800">
            ทุนสำหรับนักเรียนมัธยมปลาย
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
