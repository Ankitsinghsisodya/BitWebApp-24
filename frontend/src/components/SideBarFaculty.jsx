import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import {
  HiUser,
  HiAcademicCap,
  HiOutlineLogout,
  HiBadgeCheck,
  HiHome,
  HiDocumentReport,
  HiOutlineBriefcase,
  HiPresentationChartLine,
  HiBriefcase,
  HiBeaker
} from "react-icons/hi";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import useLinks from "./admin/user-links";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const linkclasses =
  "flex items-center gap-6 font-light p-2.5 hover:bg-neutral-700 hover:no-underline active:bg-neutral rounded-sm text-base";

export default function Sidebar() {
  const Sidebar_animation = {
    open: {
      width: "15rem",
      transition: {
        damping: 40,
      },
    },
    closed: {
      width: "4rem",
      transition: {
        damping: 40,
      },
    },
  };
  const [isOpen, setIsOpen] = useState(true);
  const facultyLinks = [
    {
      text: "Dashboard",
      icon: <HiHome />,
      to: "/faculty-db",
    },
    {
      text: "Summer Training",
      icon: <HiHome />,
      to: "/faculty-db/accept-students",
    },
    {
      text: "Major Project",
      icon: <HiPresentationChartLine />,
      to: "/faculty-db/major-project",
    },
    {
      text: "Minor Project",
      icon: <HiPresentationChartLine />,
      to: "/faculty-db/accept-minor-project",
    },
     {
      text: "Ad-hoc Projects",
      icon: <HiPresentationChartLine />,
      to: "/faculty-db/adhoc-projects-dashboard",
    },
    {
      text: "Report Issues",
      icon: <HiBeaker />,
      to: "/faculty-db/report-bug",
    },
    {
      text: "Academic Analysis",
      icon: <HiBeaker/>,
      to: "/faculty-db/academicanalysis",
    }
  ];
  // const [isAdmin, setIsAdmin] = useState(true);

  // useEffect(() => {
  //     const user = JSON.parse(localStorage.getItem("user"));
  //             setIsAdmin(user.username === "admin");
  // }, []);

  // const links = isAdmin ? adminLinks : additionalLinks;
  const links = facultyLinks;
  const navigate = useNavigate();
  const handleLogout = async () => {
    // try {
    //   const response = await axios.post("/api/v1/users/logout");
    //   console.log(response);
    //   localStorage.removeItem("user");
    //   navigate("/");
    // } catch (error) {
    //   console.log(error);
    try {
      const resp = await axios.post("/api/v1/prof/logout");
      console.log(resp);
      localStorage.removeItem("faculty");
      navigate("/");
    } catch (err) {
      console.log(err);
    } finally {
      navigate("/");
    }
  };

  return (
    <aside>
      <motion.div
        variants={Sidebar_animation}
        animate={isOpen ? "open" : "closed"}
        className="relative left-0 top-0 flex h-screen flex-col overflow-y-scroll overflow-x-hidden lg:overflow-y-scroll z-50 bg-black p-3 text-white"
        style={{ scrollbarWidth: "none" }}
      >
        <Link to="/">
          <img
            className="w-[50%] m-auto"
            src="/static/images/Birla_Institute_of_Technology_Mesra.png"
            alt=""
          />
        </Link>

        <div className="whitespace-pre flex-1 py-[1rem] text-[0.9rem] flex flex-col gap-0.5">
          {links.map((link, index) => (
            <Link
              to={link.to}
              key={index}
              className={classNames(
                "cursor-pointer border-t text-white hover:bg-orange-600 border-neutral-700",
                linkclasses
              )}
            >
              <span className="text-xl">{link.icon}</span>
              {link.text}
            </Link>
          ))}
          <div
            onClick={() => handleLogout()}
            className={classNames(
              "text-red-500 mt-[2rem] cursor-pointer border-t border-neutral-700",
              linkclasses
            )}
          >
            <span className="text-xl">
              <HiOutlineLogout />
            </span>
            Logout
          </div>

          <div
            onClick={() => setIsOpen(!isOpen)}
            className={classNames(
              "text-red-500 cursor-pointer border-t border-neutral-700",
              linkclasses
            )}
          >
            <span className="text-xl">
              <IoIosArrowBack />
            </span>
            Collapse
          </div>
        </div>
      </motion.div>
    </aside>
  );
}
