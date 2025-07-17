const formTemplates = {
  // Data Center Walkthrough Check
  '01': `
  <input type="hidden" name="checkNumber" value="01" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE"> Walkthrough Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="3" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // Tech Support Email Check
  '02': `
  <input type="hidden" name="checkNumber" value="02" />
  <div class="form-popup">
    <label><input type="checkbox" name="Completed" value="TRUE"> Email Check Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="3" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // VPN TAK & WAVE Check
  '03': `
  <input type="hidden" name="checkNumber" value="03" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE">Check Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="2" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // WUG Check
  '04': `
  <input type="hidden" name="checkNumber" value="04" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE">Check Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="2" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // TAK Server Federation Check
  '05': `
  <input type="hidden" name="checkNumber" value="05" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE">Check Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="2" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // PTL Check
  '06': `
  <input type="hidden" name="checkNumber" value="06" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE">Check Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="2" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // Message Check
  '07': `
  <input type="hidden" name="checkNumber" value="07" />
  <div class="form-content">

    <label style="padding-top: 10px;">Data:
      <div align="center" style="display: flex; gap: 20px; justify-content: center; padding-top: 10px;">
        <textarea name="Total Device Count" rows="1" placeholder="Total Device Count"
          style="width:21%; font-size:0.80rem;"></textarea>
        <textarea name="Raw Messages" rows="1" placeholder="Raw Messages"
          style="width:21%; font-size:0.80rem;"></textarea>
        <textarea name="Unique IMEIs" rows="1" placeholder="Unique IMEIs"
          style="width:21%; font-size:0.80rem;"></textarea>
        <textarea name="Free Disk Space" rows="1" placeholder="Free Disk Space"
          style="width:21%; font-size:0.80rem;"></textarea>
      </div>
    </label>
  </div>
  `,
  // Landing Pad Server Check
  '08': `
  <input type="hidden" name="checkNumber" value="08" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE"> Landing Pad Server Check Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="3" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // DS File Check
  '09': `
  <input type="hidden" name="checkNumber" value="09" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE"> DS File Check Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="3" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // WAVE Server Check
  '10': `
  <input type="hidden" name="checkNumber" value="10" />

  <div class="fly-grid">
  <div class="fly-item"><label><input type="checkbox" name="Fly-216N"> Fly-216N</label></div>
  <div class="fly-item"><label><input type="checkbox" name="Fly-220"> Fly-220</label></div>
  <div class="fly-item"><label><input type="checkbox" name="Fly-222"> Fly-222</label></div>
  <div class="fly-item"><label><input type="checkbox" name="Fly-224"> Fly-224</label></div>
  <div class="fly-item"><label><input type="checkbox" name="Fly-226"> Fly-226</label></div>

  <div class="fly-item"><label><input type="checkbox" name="Fly-228"> Fly-228</label></div>
  <div class="fly-item"><label><input type="checkbox" name="Fly-230"> Fly-230</label></div>
  <div class="fly-item"><label><input type="checkbox" name="Fly-232"> Fly-232</label></div>
  <div class="fly-item"><label><input type="checkbox" name="Fly-234"> Fly-234</label></div>
  <div class="fly-item"><label><input type="checkbox" name="Fly-236"> Fly-236</label></div>

  <div class="fly-item"><label><input type="checkbox" name="Fly-238"> Fly-238</label></div>
  <div class="fly-item"><label><input type="checkbox" name="Fly-240"> Fly-240</label></div>
  <div class="fly-item"><label><input type="checkbox" name="Fly-242"> Fly-242</label></div>
  <div class="fly-item"><label><input type="checkbox" name="Fly-244"> Fly-244</label></div>
  <div class="fly-item"><label><input type="checkbox" name="Fly-246"> Fly-246</label></div>

  <div class="fly-item"><label><input type="checkbox" name="Fly-248"> Fly-248</label></div>
  <div class="fly-item"><label><input type="checkbox" name="Fly-250"> Fly-250</label></div>
  <div class="fly-item"><label><input type="checkbox" name="Fly-252"> Fly-252</label></div>
  <div class="fly-item"><label><input type="checkbox" name="Fly-254"> Fly-254</label></div>
</div>
`,
  // Eaton Dashboard Check
  '11': `
  <input type="hidden" name="checkNumber" value="11" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE"> Eaton Dashboard Check Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="3" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // InControl Check
  '12': `
  <input type="hidden" name="checkNumber" value="12" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE"> InControl Check Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="3" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // Veeam Daily Backup Check
  '13': `
  <input type="hidden" name="checkNumber" value="13" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE"> Veeam Daily Backup Check Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="3" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // PTB Server Checks
  '14': `
  <input type="hidden" name="checkNumber" value="14" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE"> PTB Server Check Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="3" style="width:100%;"></textarea>
    </label>
  </div>
  `,
  // IPsec Check
  '15': `
  <input type="hidden" name="checkNumber" value="15" />
  <div class="form-content">
    <label><input type="checkbox" name="Completed" value="TRUE"> IPsec Check Completed</label>
    <label>Comments:
      <textarea name="Notes" rows="3" style="width:100%;"></textarea>
    </label>
  </div>
  `,
};