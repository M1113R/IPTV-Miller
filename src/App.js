import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import "./App.css";
import axios from "axios";
import Sidebar from "react-sidebar";
const M3U8FileParser = require("m3u8-file-parser");

const reader = new M3U8FileParser();

function App() {
  const [channelList, setChannelList] = useState([]);
  const [chosenChannelUrl, setChosenChannelUrl] = useState("");
  const [channelName, setChannelName] = useState("");
  const [channelSearch, setChannelSearch] = useState("");
  const [filteredChannels, setFilteredChannels] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    getChannel();
  }, []);

  const getChannel = async () => {
    const result = await axios({
      method: "get",
      url: "https://raw.githubusercontent.com/osgioia/iptv_generator/main/plex.m3u",
    });

    reader.read(result.data);
    let list = reader.getResult().segments;

    list = list.sort((a, b) => {
      if (a.inf.title < b.inf.title) {
        return -1;
      }
      if (a.inf.title > b.inf.title) {
        return 1;
      }
      return 0;
    });

    setChannelList(list);
    setFilteredChannels(list);
  };

  const searchChannel = (channel) => {
    setChannelSearch(channel);
    const channelsFilter = channelList.filter(
      (item) =>
        item?.inf?.title.toLowerCase().indexOf(channel.toLowerCase()) !== -1
    );

    setFilteredChannels(channelsFilter);
  };

  const Channel = ({ canal: channel }) => {
    return (
      <div
        style={{
          alignItems: "center",
          margin: 10,
          backgroundColor: "#152b46",
          borderRadius: 10,
          justifyContent: "center",
          width: window.innerWidth / 5 - 20,
          cursor: "pointer",
        }}
        onClick={() => {
          setChannelName(channel?.inf?.title);
          setChosenChannelUrl("");
          setTimeout(() => {
            setChosenChannelUrl(channel.url);
          }, 500);
        }}
      >
        {channel?.inf?.tvgLogo !== "" ? (
          <img
            alt={channel?.inf?.title}
            resizeMode="contain"
            src={channel?.inf?.tvgLogo}
            style={{
              height: 50,
              width: 50,
              marginRight: 30,
              borderRadius: 5,
              backgroundColor: "white",
            }}
          />
        ) : (
          <div
            style={{
              height: 50,
              width: 50,
              marginRight: 30,
              borderRadius: 25,
              backgroundColor: "white",
            }}
          />
        )}
        <div style={{ fontSize: 20, cursor: "pointer" }}>
          {channel?.inf?.title}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        backgroundColor: "#1f283b",
        display: "flex",
        justifyContent: "space-around",
        fontSize: 20,
        color: "white",
        scrollSnapType: "mandatory",
        position: "relative",
      }}
    >
      <Sidebar
        sidebar={filteredChannels.map((canal) => {
          return <Channel key={canal?.inf?.title} canal={canal} />;
        })}
        docked={sidebarOpen}
        styles={{
          sidebar: {
            background: "#1f283b",
            zIndex: 2,
            position: "absolute",
            top: 0,
            bottom: 0,
            transition: "transform .3s ease-out",
            WebkitTransition: "-webkit-transform .3s ease-out",
            willChange: "transform",
            overflowY: "auto",
          },
        }}
      >
        <button
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 999,
            backgroundColor: "transparent",
            borderWidth: 0,
            color: "white",
            fontSize: 20,
            cursor: "pointer",
          }}
          onClick={() => {
            setSidebarOpen(!sidebarOpen);
          }}
        >
          {sidebarOpen ? "Close" : "Open"}
        </button>
      </Sidebar>

      <div
        style={{
          position: "absolute",
          top: 40,
          left: window.innerWidth / 5 + 30,
          display: "flex",
          flexDirection: "column",
          zIndex: 999,
        }}
      >
        <input
          style={{
            height: 30,
            width: 250,
            borderRadius: 10,
            borderWidth: 0,
            paddingLeft: 10,
          }}
          type="text"
          value={channelSearch}
          onChange={(e) => {
            searchChannel(e.target.value);
          }}
          placeholder="Channel Name Search"
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: window.innerHeight,
          marginLeft: window.innerWidth / 5 + 30,
        }}
      >
        <div style={{ alignSelf: "center" }}>
          <h1>M1113R IPTV</h1>
        </div>
        <div style={{ paddingBottom: "40px", zIndex: 999 }}>
          <label>{channelName && `Watching: ${channelName}`}</label>
        </div>
        <div
          style={{
            alignItems: "center",
          }}
        >
          <ReactPlayer
            height={600}
            width={1024}
            autoPlay
            controls
            url={chosenChannelUrl}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
