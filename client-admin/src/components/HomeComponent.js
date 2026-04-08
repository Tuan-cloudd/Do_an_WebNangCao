import React, { Component } from 'react';

class Home extends Component {
  render() {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>ADMIN HOME</h2>

          <img
            src="https://i.pinimg.com/736x/fb/ee/af/fbeeaf3a63945d07051119bed1af43c8.jpg"
            alt="admin"
            style={styles.image}
          />
        </div>
      </div>
    );
  }
}

// 🎨 STYLE
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #74ebd5, #9face6)'
  },
  card: {
    background: '#fff',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    textAlign: 'center',
    maxWidth: '850px',
    width: '90%'
  },
  title: {
    marginBottom: '20px',
    fontWeight: 'bold'
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '10px',
    objectFit: 'cover'
  }
};

export default Home;