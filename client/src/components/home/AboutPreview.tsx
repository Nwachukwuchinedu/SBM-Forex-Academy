import { Link } from "react-router-dom";
import sbm from "../../assets/images/sbm.jpg";
import sbm1 from "../../assets/images/sbm1.jpg";

const AboutPreview = () => (
  <section className="py-12 bg-dark-lighter">
    <div className="container-custom flex flex-col md:flex-row items-center gap-8">
      <div className="flex gap-6 mb-6 md:mb-0">
        <img
          src={sbm}
          alt="Owner 1"
          className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full ring-4 ring-gold shadow-xl"
        />
        <img
          src={sbm1}
          alt="Owner 2"
          className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full ring-4 ring-emerald shadow-xl"
        />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gold mb-2">
          About SBM Forex Academy
        </h2>
        <p className="text-gray-400 mb-4 max-w-md">
          SBM Forex Academy is led by passionate traders dedicated to empowering
          others with proven strategies and real results. Discover our story and
          meet the team behind your trading success.
        </p>
        <Link to="/about" className="btn btn-primary">
          Learn More
        </Link>
      </div>
    </div>
  </section>
);

export default AboutPreview;
