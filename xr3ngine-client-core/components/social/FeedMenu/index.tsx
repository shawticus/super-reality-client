import Button from "@material-ui/core/Button";
import React, { useRef, useState } from "react";

import Creators from "../Creators";
import Featured from "../Featured";
import TheFeed from "../TheFeed";
import TipsAndTricks from "../TipsAndTricks";

import styles from './FeedMenu.module.scss';

const FeedMenu = () => {
  const containerRef = useRef<HTMLInputElement>();
  const featuredRef = useRef<HTMLInputElement>();
  const creatorsRef = useRef<HTMLInputElement>();
  const thefeedRef = useRef<HTMLInputElement>();
  const tipsandtricksRef = useRef<HTMLInputElement>();
  const [view, setView] = useState('featured');

  const padding = 40;
  const handleMenuClick = (view) =>{
    setView(view);
    
    let leftScrollPos = 0;
    switch (view) {
      case 'creators': leftScrollPos = creatorsRef.current.offsetLeft-padding; break;
      case 'thefeed': leftScrollPos = thefeedRef.current.offsetLeft-padding; break;
      case 'tipsandtricks': leftScrollPos = tipsandtricksRef.current.offsetLeft-padding; break;
      default: leftScrollPos = 0; break;
    }
    containerRef.current.scrollTo({left: leftScrollPos, behavior: 'smooth'});
  }
  let content = null;
  switch (view) {
    case 'creators': content=<Creators />;break;
    case 'thefeed': content=<TheFeed />;break;
    case 'tipsandtricks': content=<TipsAndTricks />;break;
    default:content=<Featured />;break;
  }
  const classes = {
    featured: [styles.featuredButton, view === 'featured' && styles.active],
    creators: [styles.creatorsButton, view === 'creators' && styles.active],
    thefeed: [styles.thefeedButton, view === 'thefeed' && styles.active],
    tipsandtricks: [styles.tipsandtricksButton, view === 'tipsandtricks' && styles.active],
  }
  return (
    <>
      <nav className={styles.feedMenuContainer}>  
        <section className={styles.subWrapper} ref={containerRef}>
          <section className={styles.feedMenu}>
            <Button ref={featuredRef} variant="contained" className={classes['featured'].join(' ')} onClick={()=>handleMenuClick('featured')}>Featured</Button>        
            <Button ref={creatorsRef} variant="contained" className={classes['creators'].join(' ')} onClick={()=>handleMenuClick('creators')}>Creators</Button>
            <Button ref={thefeedRef} variant="contained" className={classes['thefeed'].join(' ')} onClick={()=>handleMenuClick('thefeed')}>The Feed</Button>
            <Button ref={tipsandtricksRef} variant="contained" className={classes['tipsandtricks'].join(' ')} onClick={()=>handleMenuClick('tipsandtricks')}>Tips & Tricks</Button>
          </section>
        </section>   
      </nav>
    <section className={styles.content}>{content}</section>
  </>
  );
}

export default FeedMenu;
