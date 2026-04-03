import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Phone, Mail, ArrowLeft } from 'lucide-react-native';
import { GlassCard, GoldButton } from '../components/GlassCard';
import { ScreenShell } from '../components/ScreenShell';
import { useApp } from '../context/AppContext';

const GOLD = '#D4AF37';

export const GuestDetailsScreen = ({ navigation, route }: any) => {
  const { user } = useApp();
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [contactMethod, setContactMethod] = useState<'phone' | 'email'>('phone');

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailChange = (val: string) => {
    setGuestEmail(val);
    setEmailError(val && !validateEmail(val) ? 'Please enter a valid email address' : '');
  };

  const canSubmit = contactMethod === 'phone'
    ? guestPhone.length > 5
    : (guestEmail && validateEmail(guestEmail) && !emailError);

  const handleRequest = () => {
    const pickupLocation = route.params?.pickupLocation || user?.hotelName || 'The Grand Majestic Hotel';
    navigation.navigate('WaitingForPayment', {
      guestPhone: contactMethod === 'phone' ? guestPhone : '',
      guestEmail: contactMethod === 'email' ? guestEmail : '',
      bookingMode: 'instant',
      pickupLocation,
    });
  };

  return (
    <ScreenShell keyboardAvoiding>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color={GOLD} size={18} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <GlassCard style={styles.card}>
          <Text style={styles.title}>Guest Information</Text>
          <Text style={styles.subtitle}>* Tracking link will be sent automatically to the guest.</Text>

          <MotiView
            key={contactMethod}
            from={{ opacity: 0, translateX: contactMethod === 'phone' ? -20 : 20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 300 }}
          >
            <View style={styles.inputWrap}>
              {contactMethod === 'phone'
                ? <Phone color={GOLD} size={20} style={styles.inputIcon} />
                : <Mail color={GOLD} size={20} style={styles.inputIcon} />
              }
              <TextInput
                style={styles.input}
                placeholder={contactMethod === 'phone' ? 'Guest Phone Number' : 'Guest Email Address'}
                placeholderTextColor="#6b7280"
                value={contactMethod === 'phone' ? guestPhone : guestEmail}
                onChangeText={contactMethod === 'phone' ? setGuestPhone : handleEmailChange}
                keyboardType={contactMethod === 'phone' ? 'phone-pad' : 'email-address'}
                autoCapitalize="none"
              />
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          </MotiView>

          <TouchableOpacity onPress={() => setContactMethod(contactMethod === 'phone' ? 'email' : 'phone')} style={styles.switchBtn}>
            <Text style={styles.switchText}>
              {contactMethod === 'phone' ? "Don't have a phone? Use Email instead" : 'Use Phone Number instead'}
            </Text>
          </TouchableOpacity>

          <GoldButton onPress={handleRequest} disabled={!canSubmit} style={styles.btn}>
            <Text style={styles.btnText}>Send Chauffeur Request</Text>
          </GoldButton>
        </GlassCard>
    </ScreenShell>
  );
};

const styles = StyleSheet.create({
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  backText: { color: GOLD, fontWeight: '700', fontSize: 14 },
  card: { padding: 24 },
  title: { fontSize: 22, color: '#fff', fontWeight: '900', marginBottom: 8 },
  subtitle: { fontSize: 13, color: '#9ca3af', fontStyle: 'italic', fontWeight: '500', marginBottom: 24 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', borderWidth: 2, borderColor: 'rgba(212,175,55,0.3)', borderRadius: 12, paddingHorizontal: 14, marginBottom: 8 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: '#fff', fontSize: 16, paddingVertical: 14, fontWeight: '500' },
  errorText: { color: '#f87171', fontSize: 12, marginBottom: 8, marginLeft: 4 },
  switchBtn: { marginBottom: 24, marginTop: 8 },
  switchText: { color: GOLD, fontWeight: '700', fontSize: 13 },
  btn: { width: '100%', paddingVertical: 18 },
  btnText: { color: '#000', fontWeight: '900', fontSize: 15, textAlign: 'center', textTransform: 'uppercase' },
});
