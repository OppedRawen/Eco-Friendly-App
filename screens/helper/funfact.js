// components/EcoFact.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EcoFact() {
  const ecoFacts = [
    "Did you know? Recycling one aluminum can saves enough energy to power a TV for three hours.",
    "Fun Fact: A single tree can absorb up to 48 pounds of carbon dioxide per year.",
    "Green Tip: Biking or walking for short trips reduces your carbon footprint while keeping you healthy!",
    "Did you know? By switching to a reusable water bottle, you can save over 1,460 plastic bottles per year.",
    "Fun Fact: Turning off your faucet while brushing your teeth can save up to 8 gallons of water a day.",
    "Did you know? Plastic takes more than 400 years to decompose, and nearly every piece of plastic ever made still exists.",
    "Green Fact: Composting food scraps reduces methane emissions from landfills and enriches soil health.",
    "Fun Fact: Recycling just one ton of paper saves 17 trees, 7,000 gallons of water, and 4,000 kilowatts of electricity.",
    "Did you know? Every minute, a garbage truck worth of plastic enters our oceans—reducing plastic use helps protect marine life.",
    "Green Tip: Planting a tree not only helps clean the air but also provides shade, which can reduce energy use in your home.",
    "Fun Fact: The average family could save up to $130 a year by switching off lights when not needed.",
    "Did you know? Bees are vital to our food supply—pollinating up to 70% of the world's crops. Save the bees by planting flowers!",
    "Green Tip: The fashion industry is one of the largest polluters—choosing second-hand clothing is a stylish way to be sustainable.",
    "Did you know? If everyone in the U.S. recycled their newspapers, it would save 250 million trees each year.",
    "Fun Fact: LED light bulbs use up to 80% less energy than incandescent bulbs, lasting longer and reducing your electricity bill.",
    "Green Tip: Avoiding plastic straws can make a big difference—billions of plastic straws end up in our oceans every year.",
    "Did you know? A plant-rich diet can help reduce your carbon footprint by up to 50%.",
    "Fun Fact: Upcycling old items into new creations is not only eco-friendly but also a fun and creative activity!",
    "Green Tip: Air drying clothes can reduce your household carbon footprint by 2,400 pounds a year.",
    "Did you know? Producing one pound of beef uses 1,800 gallons of water. Cutting down on red meat consumption saves water.",
    "Fun Fact: Glass can be recycled endlessly without losing quality or purity.",
    "Did you know? Oceans produce over 50% of the oxygen we breathe, and they need our help—avoiding plastic is key!",
    "Green Tip: Instead of using paper towels, try reusable cloths to cut down on waste in your household.",
    "Fun Fact: Electric vehicles (EVs) produce fewer emissions compared to conventional cars, helping fight climate change.",
    "Did you know? Earth Day is celebrated every April 22nd, and it's a great time to think about ways to reduce our impact."
  ];

  const [randomFact, setRandomFact] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * ecoFacts.length);
    setRandomFact(ecoFacts[randomIndex]);
  }, []);

  return (
    <View style={styles.factContainer}>
      <Text style={styles.factText}>{randomFact}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  factContainer: {
    padding: 20,
    alignItems: 'center',
  },
  factText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#4CAF50',
    textAlign: 'center',
  },
});