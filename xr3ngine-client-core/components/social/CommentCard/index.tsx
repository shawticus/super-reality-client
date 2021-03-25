import React from 'react';

import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';


import styles from './CommentCard.module.scss';
import { CommentInterface } from 'xr3ngine-common/interfaces/Comment';
import { bindActionCreators, Dispatch } from 'redux';
import { addFireToFeedComment, removeFireToFeedComment } from '../../../redux/feedComment/service';
import { connect } from 'react-redux';

const mapDispatchToProps = (dispatch: Dispatch): any => ({
    addFireToFeedComment: bindActionCreators(addFireToFeedComment, dispatch),
    removeFireToFeedComment: bindActionCreators(removeFireToFeedComment, dispatch),
});

interface Props{
    addFireToFeedComment?: typeof addFireToFeedComment;
    removeFireToFeedComment?: typeof removeFireToFeedComment;
    comment: CommentInterface;
}

const CommentCard = ({comment, addFireToFeedComment, removeFireToFeedComment }: Props) => { 
    const {id, creator, fires, text, isFired } = comment;

    const handleAddFireClick = (feedId) =>addFireToFeedComment(feedId);
    const handleRemoveFireClick = (feedId) =>removeFireToFeedComment(feedId);

    return  <Card className={styles.commentItem} square={false} elevation={0} key={id}>
                <Avatar className={styles.authorAvatar} src={creator.avatar} />                                
                <CardContent className={styles.commentCard}>
                    <Typography variant="h2">
                        {creator.username}                            
                        {creator.verified && <VerifiedUserIcon htmlColor="#007AFF" style={{fontSize:'13px', margin: '0 0 0 5px'}}/>}
                    </Typography> 
                    <Typography variant="h2">{text}</Typography>                    
                    {(fires && fires > 0 ) ? <Typography variant="h2"><span className={styles.flamesCount}>{fires}</span>Flames</Typography> : null}
                </CardContent>
                <section className={styles.fire}>
                    {isFired ? 
                        <WhatshotIcon htmlColor="#FF6201" onClick={()=>handleRemoveFireClick(id)} /> 
                        :
                        <WhatshotIcon htmlColor="#DDDDDD" onClick={()=>handleAddFireClick(id)} />
                    }
                </section>
            </Card>
};

export default connect(null, mapDispatchToProps)(CommentCard);