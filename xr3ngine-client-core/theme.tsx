import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

const lightTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#5151FF',
    },
    secondary: {
      main: '#FFD600'
    },
    error: {
      main: red.A400
    },
    background: {
      default: '#000000'
    },
    text:{
      primary: '#FFFFFF',
      secondary: '#FFD600',      
    },
  },
  typography: {
    fontFamily: ["Roboto", "Helvetica", "Arial", "sans-serif"].join(','),
    
    fontSize: 14,
      button: {
        color: '#FFFFFF'        
      },
  },
  overrides: { 
    MuiTypography:{
      h1:{
        fontSize: 24,
        margin: '15px 0px',
        display: 'flex',
        alignItems: 'center',        
      },
      h2:{
        fontSize: 16,
        fontWeight: 'bold',
        margin: '5px 0px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',  
        '&.MuiTypography-colorSecondary':{
          color: '#FFD600',
        }
      },
      h3:{
        fontSize: 14,
        margin: '5px 0px',
        fontWeight: 'bold',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',  
        '&.MuiTypography-colorSecondary':{
          color: '#FFD600',
        }
      },
      h4:{
        fontSize: 14,
        margin: '5px 0px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',  
        '&.MuiTypography-colorSecondary':{
          color: '#8A8A8E',
        }
      },
      alignRight : {
        textAlign: 'right',
        justifyContent: 'flex-end',
        alignItems: 'right',
      },
      alignLeft : {
        textAlign: 'left',
        justifyContent: 'flex-start',
        alignItems: 'left',
      },
      alignCenter : {
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
      }
    },
    MuiDialog:{
      paperWidthSm:{
        maxWidth: '40%',
        width: '40%',
        margin: '0 auto',   
        fontSize: 16,       
        textAlign: 'center',
        '@media (max-width: 768px)': {
          maxWidth: '90%',
          width: '90%',
        }
      }
    },
    MuiDialogTitle:{
      root: {        
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        }
    },
    MuiDialogContent:{
      root:{
        textAlign : 'justify',
        padding: ' 0 24px 24px 24px',
      }
    },
    MuiButtonBase:{
      root:  {
        backgroundColor: 'rgba(0, 0, 0, ,0.9)',
        color: '#000000' ,
        fontSize: 16,       
        textAlign: 'center',
      },
      // colorPrimary:{
      //   backgroundColor: 'transparent',
      //   color: '#FFFFFF',
      //   '&:hover':{
      //     backgroundColor: '#5151FF',
      //   },
      // },
    },
    MuiIconButton:{
      root:{
        color: '#000000',
        '&:hover':{
          backgroundColor: 'transparent',
        }
      },
      colorPrimary:{
        backgroundColor: '#5151FF',
        color: '#FFFFFF',
        '&:hover':{
          backgroundColor: '#5151FF',
        }
      },
      colorSecondary:{
        backgroundColor: 'transparent',
        color: '#FFFFFF',
        '&:hover':{
          backgroundColor: '#5151FF',
        }
      }
    },
    MuiSlider:{
      root:{
        color: '#484848'
      },
      thumb:{
        height:'24px',
        width:'24px',
        marginTop: '-10px',        
        boxSizing: 'border-box',
      },
      thumbColorPrimary:{
        background: 'rgba(0, 0, 0, 0.8)',
        border: '2px solid #A8A8FF',
      }
    },
    MuiMenuItem:{
      root:{
        padding: '5px',
        borderRadius: '8px',
      }
    },
    MuiSnackbar:{
      root: {
        maxWidth: '80%',
        minWidth: '40%',
        width: 'auto',
        left: '30%',
        right: '30%',        
        userSelect: 'none',
        borderRadius: '8px',
        fontSize: 16,    
        backgroundColor: 'rgba(0,0,0,0.9)',
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)',
        padding: '20px',
        boxSizing: 'border-box',
        '@media (max-width: 768px)': {
          maxWidth: '90%',
          width: '90%',
          left: '5%',
          right: '5%',
        } ,
        MuiSvgIcon:{
          root:{
            height:'7em',
            width:'auto',
            color:'#000000'
          }
        }      
      },
      anchorOriginTopCenter:{
        top: '10%',
        // '@media (max-width: 768px)': {
        //   top: '10%',
        // },
      },
      anchorOriginBottomCenter:{
        bottom: '60px',
        left: '50%',
        transform: 'translate(-50%, 20px)',
      },
      anchorOriginTopLeft:{
        left: '0px',
        top: '24px',
        width: '52%',
        maxWidth: '80%',
        '@media (max-width: 768px)': {
          width: '90%',
        },
        '@media (min-width: 600px)': {
          left: '0px',
        }
      }
    },
    MuiSnackbarContent:{
      root:{
        color: '#FFFFFF',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        minWidth: '0px',
        '@media (min-width: 600px)':{
          minWidth: '0px',
        }
      }
    },
    MuiDrawer:{      
      paper:{
        padding: '20px',
        backgroundColor: 'rgba(0,0,0,0.85)',        
      },
      
      paperAnchorRight: {
        width: '25%',
        '@media (max-width: 1280px)':{
          width: '33%',
        },
        '@media (max-width: 1024px)':{
          width: '40%',
        },        
        '@media (orientation: portrait)':{
          width: '100vw',
        }
      }
    },
    MuiCardMedia:{
      media:{  
        '&:hover':{
          backgroundColor:'#A8A8FF',        
        }
      }
    },
    MuiList:{
      root:{
        background:'rgba(206,206,206,0.1)',
        color: '#FFFFFF',
      },
    },
    MuiListItem:{
      root:{
        padding: '0px',
        paddingTop: '0px',
        margin: '2px 0'
      },      
    },    
    MuiListItemText:{
      root:{
        background:'rgba(0, 0, 0, .5)',
        borderRadius: '5px',
        padding: '5px 10px',
        width: 'fit-content',
        flex: 'inherit',
        wordBreak: 'break-all',
      }
    },
    MuiCardContent:{
      root:{
        '&:last-child': {
          paddingBottom: '0px',
          paddingLeft: '0px',
          paddingRight: '0px',
          paddingTop: '0px',
        }
      }
    },
    MuiPaper:{
      root: {
        backgroundColor: 'rgba(0,0,0,0.8)',
      }
    },
    MuiInputBase:{
      input:{
        color: '#FFFFFF',
      }
    },
    MuiFormLabel:{
      root:{
        color: '#FFFFFF',
      }
    },
    MuiButton: {
      root:{
        width: '220px',    
        margin: '10px auto',
        cursor: 'pointer',    
        fontSize: 16,       
      },
      label: {
        textTransform: 'capitalize',
      },
      outlined:{
        background: 'transparent',
      },
      outlinedPrimary:{
        '&:hover':{
          boxShadow: '0 0 10px #5151FF'
        }        
      },
      outlinedSecondary:{
        '&:hover':{
          boxShadow: '0 0 10px #FFFFFF'
        }        
      },
    },  
    MuiSvgIcon:{
      colorPrimary : {
        color: '#A8A8FF', 
      },
    },
    MuiFab: {
      root: {
        height: '3em',
        width: 'fit-content',
        padding: '10px',
        margin: '0px 5px',
        display: 'flex',
        alignItems: 'center', 
        textTransform: 'capitalize',
        text:{
          color: '#FFFFFF' 
        }           
      },
      primary:{
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderRadius: '8px',
      }
    },
    MuiFormGroup:{
      root:{
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
      }
    } ,
    MuiBadge:{
      anchorOriginTopLeftRectangle:{
        left: '6px',
      },
      dot: {
        height: '12px',
        width: '12px',
        borderRadius: '50%',
      },
      colorPrimary : {
        backgroundColor: '#7AFF64', 
      },
    },
  },
});

// export default darkTheme;
export default lightTheme;
